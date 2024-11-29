// 定义颜色类型，用于表示RGB颜色
export type Color = {
    r: number;
    g: number;
    b: number;
};

// 定义相机类型，用于表示二维空间中的位置
export type Camera = {
    x: number;
    y: number;
};

// 定义图层类型枚举，用于区分不同类型的图层
export enum LayerType {
    Text,
    Note,
    Rectangle,
    Ellipse,
    Path,
}

// 定义矩形图层类型，包含矩形的具体属性
export type RectangleLayer = {
    type: LayerType.Rectangle;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    value?: string;
};

// 定义椭圆图层类型，包含椭圆的具体属性
export type EllipseLayer = {
    type: LayerType.Ellipse;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    value?: string;
};

// 定义路径图层类型，包含路径的具体属性
export type PathLayer = {
    type: LayerType.Path;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    points: number[][];
    value?: string;
};

// 定义文本图层类型，包含文本的具体属性
export type TextLayer = {
    type: LayerType.Text;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    value?: string;
};

// 定义注释图层类型，包含注释的具体属性
export type NoteLayer = {
    type: LayerType.Note;
    x: number;
    y: number;
    height: number;
    width: number;
    fill: Color;
    value?: string;
};

// 定义点类型，用于表示二维空间中的点坐标
export type Point = {
    x: number;
    y: number;
};

// 定义XYWH类型，用于表示矩形区域的左上角坐标及宽高
export type XYWH = {
    x: number;
    y: number;
    width: number;
    height: number;
};

// 定义边枚举类型，用于表示矩形的四个边
export enum Side {
    Top = 1,
    Bottom = 2,
    Left = 4,
    Right = 8,
}

export type CanvasState =
    | {
          mode: CanvasMode.None;
      }
    | {
          mode: CanvasMode.Pressing;
          origin: Point;
      }
    | {
          mode: CanvasMode.SelectionNet;
          origin: Point;
          current?: Point;
      }
    | {
          mode: CanvasMode.Translating;
          current: Point;
      }
    | {
          mode: CanvasMode.Inserting;
          layerType:
              | LayerType.Ellipse
              | LayerType.Rectangle
              | LayerType.Text
              | LayerType.Note;
      }
    | {
          mode: CanvasMode.Resizing;
          initialBounds: XYWH;
          corner: Side;
      }
    | {
          mode: CanvasMode.Pencil;
      };

// 定义画布操作模式枚举，用于区分不同的画布操作状态
export enum CanvasMode {
    None,
    Pressing, // 按下
    SelectionNet, // 选择
    Translating, // 移动
    Inserting, // 插入
    Resizing, // 调整大小
    Pencil, // 画笔
}

// 定义层类型，用于表示不同类型的图层
export type Layer =
    | RectangleLayer // 矩形
    | EllipseLayer // 椭圆
    | PathLayer //  路径
    | TextLayer // 文本
    | NoteLayer; //  便签
