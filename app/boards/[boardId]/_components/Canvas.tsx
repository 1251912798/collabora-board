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
    Side,
    XYWH,
} from "@/types/canvas";
import CursorsPresence from "./CursorsPresence";
import {
    colorToCss,
    connectionIdToColor,
    findIntersectingLayersWithRectangle,
    penPointsToPathLayer,
    pointerEventToCanvasPoint,
    resizeBounds,
} from "@/lib/utils";
import {
    useOthersMapped,
    useSelf,
    useStorage,
} from "@liveblocks/react/suspense";
import { LiveObject } from "@liveblocks/client";
import LayerPreview from "./LayerPreview";
import SelectionBox from "./SelectionBox";
import SelectionTools from "./SelectionTools";
import Path from "./Path";

const MAX_LAYERS = 100;

interface CanvasProps {
    boardId: string;
}

const Canvas = ({ boardId }: CanvasProps) => {
    const layerIds = useStorage((root) => root.layerIds);

    // 使用useSelf钩子获取当前用户的铅笔草稿状态
    const pencilDraft = useSelf((self) => self.presence.pencilDraft);

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

    // 调整选定图层大小的突变钩子函数
    const resizeSelectedLayer = useMutation(
        // 参数包括自我状态和存储对象，以及用于调整大小的点
        ({ storage, self }, point: Point) => {
            if (canvasState.mode !== CanvasMode.Resizing) {
                return;
            }
            // 计算新的边界并更新图层
            const bounds = resizeBounds(
                canvasState.initialBounds,
                canvasState.corner,
                point
            );
            const liveLayers = storage.get("layers");
            const layer = liveLayers.get(self.presence.selection[0]);

            if (layer) {
                layer.update(bounds);
            }
        },
        [canvasState]
    );

    const translateSelectedLayers = useMutation(
        ({ storage, self }, point: Point) => {
            if (canvasState.mode !== CanvasMode.Translating) {
                return;
            }

            const offset = {
                x: point.x - canvasState.current.x,
                y: point.y - canvasState.current.y,
            };

            const liveLayers = storage.get("layers");

            for (const id of self.presence.selection) {
                const layer = liveLayers.get(id);

                if (layer) {
                    layer.update({
                        x: layer.get("x") + offset.x,
                        y: layer.get("y") + offset.y,
                    });
                }
            }

            setCanvasState({ mode: CanvasMode.Translating, current: point });
        },
        [canvasState]
    );

    // 使用useMutation钩子来更新选择网络，即通过拖拽形成的选区
    const updateSelectionNet = useMutation(
        // 函数参数包括存储对象，设置我的状态的函数，当前点和起始点的位置
        ({ storage, setMyPresence }, current: Point, origin: Point) => {
            const layers = storage.get("layers").toImmutable();
            // 更新画布状态，设置当前模式为选择网络模式，并更新起始点和当前点的位置
            setCanvasState({
                mode: CanvasMode.SelectionNet,
                origin,
                current,
            });

            // 找到与选择区域相交的图层ID，并更新我的状态中的选择
            const ids = findIntersectingLayersWithRectangle(
                layerIds,
                layers,
                origin,
                current
            );

            setMyPresence({ selection: ids });
        },
        // 依赖数组，当layerIds变化时，mutation会重新创建
        [layerIds]
    );

    // 使用useCallback钩子来优化开始多选的操作
    const startMultiSelection = useCallback(
        // 函数参数为当前点和起始点的位置
        (current: Point, origin: Point) => {
            // 如果当前点和起始点之间的距离大于5，则更新画布状态进入选择网络模式
            if (
                Math.abs(current.x - origin.x) +
                    Math.abs(current.y - origin.y) >
                5
            ) {
                setCanvasState({
                    mode: CanvasMode.SelectionNet,
                    origin,
                    current,
                });
            }
        },
        // 依赖数组为空，回调函数不会因组件重新渲染而改变
        []
    );

    const startDrawing = useMutation(
        ({ setMyPresence }, point: Point, pressure: number) => {
            setMyPresence({
                pencilDraft: [[point.x, point.y, pressure]],
                pencilColor: lastUsedColor,
            });
        },
        // 依赖项列表，此处依赖lastUsedColor
        [lastUsedColor]
    );

    // 使用useMutation钩子来持续绘图，即在使用铅笔工具时追踪笔迹
    const continueDrawing = useMutation(
        // 函数参数包括self对象，设置我的状态的函数，当前点和React的指针事件
        ({ self, setMyPresence }, point: Point, event: React.PointerEvent) => {
            const { pencilDraft } = self.presence;

            // 如果当前模式不是铅笔模式，或者鼠标按钮没有被按下，或者没有铅笔草稿，则不执行任何操作
            if (
                canvasState.mode !== CanvasMode.Pencil ||
                event.buttons !== 1 ||
                !pencilDraft
            )
                return;

            // 更新我的状态，包括光标位置和铅笔草稿
            setMyPresence({
                cursor: point,
                pencilDraft:
                    // 如果草稿只有一个点且与当前点相同，则保持草稿不变，否则添加当前点到草稿中
                    pencilDraft.length === 1 &&
                    pencilDraft[0][0] === point.x &&
                    pencilDraft[0][1] === point.y
                        ? pencilDraft
                        : [...pencilDraft, [point.x, point.y, event.pressure]],
            });
        },
        // 依赖数组，当canvasState.mode变化时，mutation会重新创建
        [canvasState.mode]
    );

    const insertPath = useMutation(
        ({ storage, self, setMyPresence }) => {
            const liveLayers = storage.get("layers");
            const { pencilDraft } = self.presence;

            // 检查是否满足插入路径的条件
            if (
                !pencilDraft ||
                pencilDraft.length < 2 ||
                liveLayers.size >= MAX_LAYERS
            ) {
                setMyPresence({ pencilDraft: null });
                return;
            }

            // 生成新路径的唯一ID，并在liveLayers中插入新的LiveObject
            const id = nanoid();
            liveLayers.set(
                id,
                new LiveObject(penPointsToPathLayer(pencilDraft, lastUsedColor))
            );

            // 更新layerIds，将新生成的ID加入列表
            const liveLayerIds = storage.get("layerIds");
            liveLayerIds.push(id);

            // 清空铅笔草稿并设置画布状态为铅笔模式
            setMyPresence({ pencilDraft: null });
            setCanvasState({
                mode: CanvasMode.Pencil,
            });
        },
        [lastUsedColor]
    );

    // 使用useOthersMapped钩子获取其他用户的选区数据
    const selections = useOthersMapped((other) => other.presence.selection);

    // 取消选择
    const unSelectLayers = useMutation(({ self, setMyPresence }) => {
        if (self.presence.selection.length > 0) {
            setMyPresence({ selection: [] }, { addToHistory: true });
        }
    }, []);

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

            if (canvasState.mode === CanvasMode.Pressing) {
                startMultiSelection(current, canvasState.origin);
            } else if (canvasState.mode === CanvasMode.SelectionNet) {
                updateSelectionNet(current, canvasState.origin);
            } else if (canvasState.mode === CanvasMode.Translating) {
                translateSelectedLayers(current);
            } else if (canvasState.mode === CanvasMode.Resizing) {
                resizeSelectedLayer(current);
            } else if (canvasState.mode === CanvasMode.Pencil) {
                continueDrawing(current, e);
            }

            // 更新自我状态中的光标位置
            setMyPresence({ cursor: current });
        },
        [
            camera,
            canvasState,
            resizeSelectedLayer,
            translateSelectedLayers,
            startMultiSelection,
            updateSelectionNet,
            continueDrawing,
        ]
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

            if (
                canvasState.mode === CanvasMode.None ||
                canvasState.mode === CanvasMode.Pressing
            ) {
                unSelectLayers();
                setCanvasState({ mode: CanvasMode.None });
            } else if (canvasState.mode === CanvasMode.Pencil) {
                insertPath();
            } else if (canvasState.mode === CanvasMode.Inserting) {
                insertLayer(canvasState.layerType, point);
            } else {
                setCanvasState({
                    mode: CanvasMode.None,
                });
            }

            history.resume();
        },
        [
            camera,
            canvasState,
            history,
            unSelectLayers,
            insertPath,
            setCanvasState,
        ]
    );

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

    const onPointerDown = useCallback(
        (e: React.PointerEvent) => {
            const point = pointerEventToCanvasPoint(e, camera);

            if (canvasState.mode === CanvasMode.Inserting) {
                return;
            }

            if (canvasState.mode === CanvasMode.Pencil) {
                startDrawing(point, e.pressure);
                return;
            }

            setCanvasState({ origin: point, mode: CanvasMode.Pressing });
        },
        [camera, canvasState.mode, setCanvasState, startDrawing]
    );

    // 处理调整大小句柄指针按下事件的回调函数
    const onResizeHandlePointerDown = useCallback(
        (corner: Side, initialBounds: XYWH) => {
            // 暂停历史记录
            history.pause();
            setCanvasState({
                mode: CanvasMode.Resizing,
                initialBounds,
                corner,
            });
        },
        [history]
    );

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
            <SelectionTools
                camera={camera}
                setLastUsedColor={setLastUsedColor}
            />
            <svg
                className="h-[100vh] w-[100vw]"
                onWheel={onWheel}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                onPointerUp={onPointerUp}
                onPointerDown={onPointerDown}>
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
                    {canvasState.mode === CanvasMode.SelectionNet &&
                        canvasState.current && (
                            <rect
                                className="fill-blue-500/5 stroke-blue-500 stroke-1"
                                x={Math.min(
                                    canvasState.origin.x,
                                    canvasState.current.x
                                )}
                                y={Math.min(
                                    canvasState.origin.y,
                                    canvasState.current.y
                                )}
                                width={Math.abs(
                                    canvasState.origin.x - canvasState.current.x
                                )}
                                height={Math.abs(
                                    canvasState.origin.y - canvasState.current.y
                                )}
                            />
                        )}
                    <CursorsPresence />
                    {pencilDraft && pencilDraft.length > 0 && (
                        <Path
                            fill={colorToCss(lastUsedColor)}
                            points={pencilDraft}
                            x={0}
                            y={0}
                        />
                    )}
                </g>
            </svg>
        </main>
    );
};

export default Canvas;
