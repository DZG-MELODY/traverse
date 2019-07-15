import fs from "fs";
import path from "path";
import {
  TraverseNode,
  TraverseOptions,
  TraversePredicate,
  TraverseNodeHandler,
  TraverseNodeParams,
  traverseRecursive
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
  params: TraverseNodeParams<FileNode>,
  options: TraverseOptions<FileNode>,
  result: PlainObject
) => void;

interface FileTraverseInnerOptions {
  fileNodeHandle?: FileNodeHandle;
  [propName: string]: any;
}

export type FileTraverseOptions = FileTraverseInnerOptions &
  TraverseOptions<FileNode>;

// 迭代谓词方法
const filePredicate: TraversePredicate<FileNode> = fileNode => {
  const { filePath } = fileNode;
  const hasChildFile =
    fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
  const fileNodes: Array<FileNode> = hasChildFile
    ? fs.readdirSync(filePath).map(file => ({
        fileName: file,
        filePath: path.resolve(filePath, file),
        fileStatus: fs.statSync(path.resolve(filePath, file))
      }))
    : [];
  return {
    done: !hasChildFile,
    iterators: fileNodes
  };
};

// 文件节点处理方法
const fileNodeHandle: TraverseNodeHandler<FileNode, FileTraverseOptions> = (
  node,
  nodeParams,
  options,
  result
) => {
  const { fileNodeHandle } = options;
  if (fileNodeHandle && typeof fileNodeHandle === "function")
    fileNodeHandle(node, nodeParams, options, result);
  return node;
};

export function traverseFiles(
  directories: string[],
  options: FileTraverseInnerOptions
) {
  const dirNodes: FileNode[] = directories.map(dir => ({
    fileName: path.basename(dir),
    filePath: path.resolve(dir),
    fileStatus: fs.statSync(path.resolve(dir))
  }));
  return traverseRecursive<FileNode>(
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
