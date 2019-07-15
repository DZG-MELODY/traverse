import { BaseOptions } from "../shared/types";

/**
 * 遍历节点
 */
export interface TraverseNode {}

/**
 * 遍历节点相关参数
 */
export interface TraverseNodeParams<T extends TraverseNode> {
  path: Array<T>;
  isFirst: boolean;
  isLast: boolean;
  isLeaf: boolean;
}

/**
 * 遍历谓语结果
 */
export interface PredicateResult<T extends TraverseNode> {
  // 是否遍历完成
  done: boolean;
  // 下级遍历对象
  iterators: Array<T>;
}

/**
 * 节点遍历谓语
 */
export type TraversePredicate<T extends TraverseNode> = (
  node: T
) => PredicateResult<T>;

/**
 * 文件节点处理方法
 */
export type TraverseNodeHandler<T extends TraverseNode, O> = (
  node: T,
  nodeParams: TraverseNodeParams<T>,
  options: O,
  result: TraverseResult
) => T;

/**
 * 遍历选项
 */
export interface TraverseOptions<T extends TraverseNode, O> {
  readonly predicate: TraversePredicate<T>;
  readonly nodeHandle: TraverseNodeHandler<T, TraverseOptions<T, O>>;
  readonly exclude?: (
    node: TraverseNode,
    nodeParams: TraverseNodeParams<T>,
    options: TraverseOptions<T, O> & O
  ) => boolean;
  readonly ignore?: (
    node: TraverseNode,
    nodeParams: TraverseNodeParams<T>,
    options: TraverseOptions<T, O> & O
  ) => boolean;
}

export interface TraverseResult {
  [propName: string]: any;
}

export function traverseRecursive<T>(
  nodes: T[],
  options: TraverseOptions<T, BaseOptions>
): TraverseResult {
  const result = {};

  // 判定方法必须为方法
  if (!options.predicate) {
    throw new Error("predicate is not a function");
  }

  // 节点处理必须为方法
  if (!options.nodeHandle) {
    throw new Error("nodeHandle is not a function");
  }

  // 递归遍历所有节点
  function _traverse(
    node: T,
    nodeParams: TraverseNodeParams<T>,
    options: TraverseOptions<T, BaseOptions>
  ): void {
    // 当前节点如果有子节点，则先将该节点推入到path路径中，遍历完成后再吐出
    const { done, iterators } = options.predicate(node);
    // 无法继续递归，则为叶子节点
    nodeParams.isLeaf = done;

    // 处理node节点
    // 如果满足排除条件，则不进行节点处理
    if (options.exclude && options.exclude(node, nodeParams, options)) {
      node = node;
    } else {
      node = options.nodeHandle(node, nodeParams, options, result);
    }

    // 如果满足忽略条件，则不再进行下级遍历
    if (options.ignore && options.ignore(node, nodeParams, options)) return;

    // 非叶子节点继续遍历
    if (!done) {
      // 将当前节点推入路径
      nodeParams.path.push(node);
      // 子节点进行递归
      iterators.forEach((subNode, index) => {
        _traverse(
          subNode,
          {
            path: nodeParams.path,
            isFirst: index === 0,
            isLast: index === iterators.length - 1,
            isLeaf: false
          },
          options
        );
      });
      // 递归完毕后，当前节点从path数组中冒泡
      nodeParams.path.pop();
    }
  }

  // 遍历首层节点
  nodes.forEach((subNode, index) => {
    _traverse(
      subNode,
      {
        path: [],
        isFirst: index === 0,
        isLast: index === nodes.length,
        isLeaf: false
      },
      options
    );
  });

  return result;
}
