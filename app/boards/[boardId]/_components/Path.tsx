import { getSvgPathFromStroke } from "@/lib/utils"; // 导入从笔触生成SVG路径的工具函数
import getStroke from "perfect-freehand"; // 导入用于生成自然手绘笔触的库

interface PathProps {
    x: number; // 路径的x坐标
    y: number; // 路径的y坐标
    points: number[][]; // 路径的坐标点数组
    fill: string; // 路径的填充颜色
    onPointerDown?: (e: React.PointerEvent) => void; // 可选的指针按下事件处理函数
    stroke?: string; // 路径的轮廓颜色，如果未指定则默认无轮廓
}

/**
 * Path组件用于渲染一个带有手绘效果的SVG路径。
 * 它通过perfect-freehand库生成自然手绘笔触，并将其转换为SVG路径进行渲染。
 *
 * @param {PathProps} props - 路径的属性，包括位置、笔触点、填充色、指针事件处理等。
 * @returns {JSX.Element} - 渲染后的SVG路径元素。
 */

const Path = ({ x, y, points, fill, onPointerDown, stroke }: PathProps) => {
    return (
        <path
            className="drop-shadow-md"
            onPointerDown={onPointerDown}
            d={getSvgPathFromStroke(
                getStroke(points, {
                    size: 16, // 笔触的基本大小
                    thinning: 0.5, // 笔触变细的程度
                    smoothing: 0.5, // 笔触的平滑度
                    streamline: 0.5, // 笔触的流线化程度
                })
            )}
            style={{
                transform: `translate(${x}px, ${y}px)`, // 将路径移动到指定的位置
            }}
            x={0}
            y={0}
            fill={fill}
            stroke={stroke}
            strokeWidth={1}
        />
    );
};

export default Path;
