import fs from "fs";
import path from "path";
import {
  TraverseNode,
  TraverseOptions,
  TraversePredicate,
  TraverseNodeHandler,
  TraverseNodeParams,
  traverse_recursive
} from "../traverse-core/traverse-recursive";
import { PlainObject } from "../shared/types";

/**
 * 文件节点
 */
export interface FileNode extends TraverseNode {
  fileName: string;
  filePath: string;
  fileStatus: fs.Stats;
}

export type FileNodeHandle = (
  node: FileNode,
  params: TraverseNodeParams,
  options: TraverseOptions,
  result: PlainObject
) => void;

/**
 *
 */
export interface FileTraverseOptions extends TraverseOptions {
  fileNodeHandle?: FileNodeHandle;
  [propName: string]: any;
}

// 迭代谓词方法
const filePredicate: TraversePredicate = (fileNode: TraverseNode) => {
  const { filePath } = fileNode as FileNode;
  const hasChildFile =
    fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
  const fileNodes = hasChildFile
    ? fs.readdirSync(filePath).map(file => ({
        fileName: file,
        filePath: path.resolve(filePath, file)
      }))
    : [];
  return {
    done: !hasChildFile,
    iterators: fileNodes
  };
};

// 文件节点处理方法
const fileNodeHandle: TraverseNodeHandler = (
  node,
  nodeParams,
  options,
  result
) => {
  const { filePath } = node as FileNode;
  (node as FileNode).fileStatus = fs.statSync(filePath);
  const { fileNodeHandle } = options as FileTraverseOptions;
  if (fileNodeHandle && typeof fileNodeHandle === "function")
    fileNodeHandle(node as FileNode, nodeParams, options, result);
  return node;
};

export function traverse_file(
  directories: string[],
  options: FileTraverseOptions
) {
  const dirNodes: FileNode[] = directories.map(dir => ({
    fileName: path.basename(dir),
    filePath: path.resolve(dir),
    fileStatus: fs.statSync(path.resolve(dir))
  }));
  return traverse_recursive(
    dirNodes,
    Object.assign(
      {
        predicate: filePredicate,
        nodeHandle: fileNodeHandle
      },
      options
    )
  );
}
