import { cn, colorToCss } from "@/lib/utils"; // 导入工具函数
import { TextLayer } from "@/types/canvas"; // 导入文本图层类型
import { useMutation } from "@liveblocks/react";
import { Kalam } from "next/font/google"; // 导入Google字体
import ContentEditable, { ContentEditableEvent } from "react-contenteditable"; // 导入可编辑内容组件

// 定义字体变量，用于统一管理文本的字体样式
const font = Kalam({
    subsets: ["latin"], // 字体子集
    weight: ["400"], // 字体重量
});

// 定义文本属性接口，用于文本组件的属性声明
interface TextProps {
    id: string; // 文本的唯一标识
    layer: TextLayer; // 文本图层对象
    onPointerDown: (e: React.PointerEvent, id: string) => void; // 鼠标按下事件回调
    selectionColor?: string; // 选中颜色，可选
}

/**
 * 计算文本的字体大小
 * @param width 文本框的宽度
 * @param height 文本框的高度
 * @returns 计算后的字体大小
 */
const calculateFontSize = (width: number, height: number) => {
    const maxFontSize = 96; // 最大字体大小
    const scaleFactor = 0.5; // 尺寸缩放因子
    const fontSizeBasedOnHeight = height * scaleFactor; // 基于高度计算的字体大小
    const fontSizeBasedOnWidth = width * scaleFactor; // 基于宽度计算的字体大小

    // 返回最小的字体大小，确保不超过最大值，并且适应宽度和高度
    return Math.min(maxFontSize, fontSizeBasedOnHeight, fontSizeBasedOnWidth);
};

const Text = ({ id, layer, onPointerDown, selectionColor }: TextProps) => {
    // 解构文本层的属性
    const { x, y, width, height, fill, value } = layer;

    /**
     * 使用mutation钩子来更新文本层的值
     * @param {Object} newValue - 新的文本值
     */
    const updateValue = useMutation(({ storage }, newValue: string) => {
        const liveLayers = storage.get("layers");

        liveLayers.get(id)?.set("value", newValue);
    }, []);

    /**
     * 处理文本内容的变化
     * @param {ContentEditableEvent} e - 内容可编辑事件
     */
    const hanldeContentChange = (e: ContentEditableEvent) => {
        updateValue(e.target.value);
    };

    // 渲染文本组件
    return (
        <foreignObject
            x={x}
            y={y}
            height={height}
            width={width}
            onPointerDown={(e) => onPointerDown(e, id)}
            style={{
                outline: selectionColor
                    ? `1px solid ${selectionColor}`
                    : "none",
            }}>
            <ContentEditable
                html={value || "Text"}
                onChange={hanldeContentChange}
                className={cn(
                    "h-full w-full flex items-center justify-center drop-shadow-md outline-none",
                    font.className
                )}
                style={{
                    color: fill ? colorToCss(fill) : "#000",
                    fontSize: calculateFontSize(width, height),
                }}
            />
        </foreignObject>
    );
};

export default Text;
