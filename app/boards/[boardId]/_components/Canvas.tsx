"use client";

import {
    useHistory,
    useCanRedo,
    useCanUndo,
    useMutation,
} from "@liveblocks/react";
import { nanoid } from "nanoid";
import Info from "./Info";
import Toolbar from "./Toolbar";
import Participants from "./Participants";
import { useCallback, useMemo, useState } from "react";
import {
    Camera,
    CanvasMode,
    CanvasState,
    Color,
    LayerType,
    Point,
} from "@/types/canvas";
import CursorsPresence from "./CursorsPresence";
import { connectionIdToColor, pointerEventToCanvasPoint } from "@/lib/utils";
import { useOthersMapped, useStorage } from "@liveblocks/react/suspense";
import { LiveObject } from "@liveblocks/client";
import LayerPreview from "./LayerPreview";
import SelectionBox from "./SelectionBox";

const MAX_LAYERS = 100;

interface CanvasProps {
    boardId: string;
}

const Canvas = ({ boardId }: CanvasProps) => {
    const layerIds = useStorage((root) => root.layerIds);

    const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None,
    });
    const [lastUsedColor, setLastUsedColor] = useState<Color>({
        r: 255,
        g: 255,
        b: 255,
    });

    // 获取历史操作数据，用于撤销和重做功能
    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

    // 处理滚轮事件的回调函数，用于调整相机位置
    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera((camera) => ({
            x: camera.x - e.deltaX,
            y: camera.y - e.deltaY,
        }));
    }, []);

    // 处理指针移动事件
    const onPointerMove = useMutation(
        ({ setMyPresence }, e: React.PointerEvent) => {
            e.preventDefault();

            const current = pointerEventToCanvasPoint(e, camera);
            setMyPresence({ cursor: current });
        },
        []
    );

    // 使用useMutation钩子处理图层的插入操作，参数包括存储对象、当前用户状态和新图层的属性
    const insertLayer = useMutation(
        (
            { storage, setMyPresence },
            layerType:
                | LayerType.Ellipse
                | LayerType.Rectangle
                | LayerType.Text
                | LayerType.Note,
            position: Point
        ) => {
            // 获取当前所有图层的集合
            const liveLayers = storage.get("layers");
            // 如果当前图层数量已经达到上限，则停止创建新图层
            if (liveLayers.size >= MAX_LAYERS) {
                return;
            }

            // 获取当前所有图层ID的集合
            const liveLayerIds = storage.get("layerIds");

            // 生成新图层的唯一ID
            const layerId = nanoid();

            // 创建一个新的LiveObject类型的图层，初始化其属性
            const layer = new LiveObject({
                type: layerType,
                x: position.x,
                y: position.y,
                width: 100,
                height: 100,
                fill: lastUsedColor,
            });

            // 将新图层的ID添加到图层ID集合中
            liveLayerIds.push(layerId);
            // 将新图层添加到图层集合中
            liveLayers.set(layerId, layer);

            // 更新当前用户的状态，选择新创建的图层，并记录该操作到历史中
            setMyPresence({ selection: [layerId] }, { addToHistory: true });
            // 重置画布模式为无操作模式
            setCanvasState({
                mode: CanvasMode.None,
            });
        },
        [lastUsedColor] // 依赖项列表，当最后使用的颜色变化时，重新计算插入图层的操作
    );

    // 当指针离开画布时调用的处理函数，用于更新用户的存在状态
    const onPointerLeave = useMutation(({ setMyPresence }) => {
        setMyPresence({ cursor: null });
    }, []);

    // 处理指针抬起事件的函数，根据当前画布模式执行相应的操作
    const onPointerUp = useMutation(
        ({}, e) => {
            // 将指针事件转换为画布上的点
            const point = pointerEventToCanvasPoint(e, camera);

            if (canvasState.mode === CanvasMode.Inserting) {
                insertLayer(canvasState.layerType, point);
            } else {
                setCanvasState({
                    mode: CanvasMode.None,
                });
            }

            history.resume();
        },
        [camera, canvasState, history]
    );

    // 使用useOthersMapped钩子获取其他用户的选区数据
    const selections = useOthersMapped((other) => other.presence.selection);

    // 使用useMemo钩子计算图层ID到颜色的映射，优化性能，避免不必要的重复计算
    const layerIdsToColorSelection = useMemo(() => {
        const layerIdsToColorSelection: Record<string, string> = {};

        for (const user of selections) {
            const [connectionId, selection] = user;

            for (const layerId of selection) {
                layerIdsToColorSelection[layerId] =
                    connectionIdToColor(connectionId);
            }
        }

        return layerIdsToColorSelection;
    }, [selections]);

    // 定义一个用于处理图层指针事件的函数，该函数会在指针按下时调用
    // 该函数的目的是在用户开始拖动指针时，更新画布状态，以便进行移动或选择操作
    const onLayerPointerDown = useMutation(
        ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
            // 如果当前模式是铅笔或插入模式，直接返回不处理
            if (
                canvasState.mode === CanvasMode.Pencil ||
                canvasState.mode === CanvasMode.Inserting
            ) {
                return;
            }
            // 暂停历史记录，阻止事件进一步传播
            history.pause();
            e.stopPropagation();

            // 将指针事件转换为画布坐标
            const point = pointerEventToCanvasPoint(e, camera);

            // 如果当前用户的存在状态中没有选择该图层，则更新选择状态
            if (!self.presence.selection.includes(layerId)) {
                setMyPresence({ selection: [layerId] }, { addToHistory: true });
            }

            // 更新画布状态为移动模式，并记录当前坐标
            setCanvasState({ mode: CanvasMode.Translating, current: point });
        },
        [setCanvasState, camera, history, canvasState.mode]
    );

    const onResizeHandlePointerDown = () => {};

    return (
        <main className="h-full w-full relative bg-neutral-100 touch-none">
            <Info boardId={boardId} />
            <Participants />
            <Toolbar
                canRedo={!canUndo}
                canUndo={!canRedo}
                undo={history.undo}
                redo={history.redo}
                canvasState={canvasState}
                setCanvasState={setCanvasState}
            />
            <svg
                className="h-[100vh] w-[100vw]"
                onWheel={onWheel}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                onPointerUp={onPointerUp}>
                <g
                    style={{
                        transform: `translate(${camera.x}px, ${camera.y}px)`,
                    }}>
                    {layerIds.map((layerId) => (
                        <LayerPreview
                            key={layerId}
                            id={layerId}
                            onLayerPointerDown={onLayerPointerDown}
                            selectionColor={layerIdsToColorSelection[layerId]}
                        />
                    ))}
                    <SelectionBox
                        onResizeHandlePointerDown={onResizeHandlePointerDown}
                    />
                    <CursorsPresence />
                </g>
            </svg>
        </main>
    );
};

export default Canvas;
