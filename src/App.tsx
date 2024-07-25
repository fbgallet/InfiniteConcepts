import type { Edge, Node, OnConnect } from "reactflow";

import { useState, useCallback, MouseEvent, useRef } from "react";
import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useReactFlow,
} from "reactflow";

import Sidebar from "./components/Sidebar.jsx";
import { randomConceptEnPrompt } from "./ai/prompts.ts";

import "reactflow/dist/style.css";

import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";
import { claudeAPImessage } from "./ai/api-requets";
import {
  addToExistingConcepts,
  combinationsDB,
  concepts,
  getConceptIcon,
  getConceptTitle,
  getStoredCombination,
} from "./utils/data.ts";

let id: string = "2";
const getId = (): string => `${parseInt(id) + 1}`;

function Flow() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const { getIntersectingNodes } = useReactFlow();
  const { screenToFlowPosition } = useReactFlow();

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((edges) => addEdge(connection, edges)),
    []
  );

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onNodeDrag = useCallback((_: MouseEvent, node: Node) => {
    const intersections: string[] = getIntersectingNodes(node).map((n) => n.id);

    setNodes((ns) =>
      ns.map((n) => ({
        ...n,
        className: intersections.includes(n.id) ? "highlight" : "",
      }))
    );
  }, []);

  const onNodeDragStop = useCallback(async (_: MouseEvent, node: Node) => {
    const intersections: Node[] = getIntersectingNodes(node);

    if (intersections.length) {
      combineTwoNodesInOne(node, intersections);
    }
  }, []);

  const combineTwoNodesInOne = async (
    node: Node,
    intersections: Node[]
  ): Promise<void> => {
    const conceptA: string = getConceptTitle(node.data.label);
    const conceptB: string = getConceptTitle(intersections[0].data.label);

    const existingCombination = getStoredCombination([conceptA, conceptB]);
    let nodeLabel = "";
    if (existingCombination) {
      const matchingConcept = concepts.find(
        (concept) => concept.title === existingCombination
      );
      const matchingIcon = matchingConcept?.icon;
      nodeLabel = matchingIcon + " " + existingCombination;
    } else {
      nodeLabel = await claudeAPImessage(
        `${conceptA} + ${conceptB} = [resulting term to be provided as your response]`
      );
    }

    const newNode = {
      id: getId(),
      type: "node-toolbar",
      position: {
        x: intersections[0].position.x,
        y: intersections[0].position.y,
      },
      data: {
        label: nodeLabel,
      },
    };

    const icon = getConceptIcon(newNode.data.label);
    const title = getConceptTitle(newNode.data.label);
    const existingConcept = addToExistingConcepts({ title, icon });

    if (existingConcept)
      newNode.data.label = `${existingConcept.icon} ${existingConcept.title}`;

    if (!existingCombination) {
      combinationsDB.push({
        combined: [conceptA, conceptB],
        result: title,
        count: 1,
      });
      localStorage.InfiniteCombinations = JSON.stringify(combinationsDB);
    }

    setNodes((nds) =>
      nds
        .filter((ns) => !(ns.id === node.id || ns.id === intersections[0].id))
        .concat(newNode)
    );
  };

  const onPaneClick = async (event: React.MouseEvent) => {
    const newWord = await claudeAPImessage(randomConceptEnPrompt, false);
    const position = screenToFlowPosition({
      x: event.clientX - 150,
      y: event.clientY - 40,
    });
    const newNode = {
      id: getId(),
      type: "node-toolbar",
      position,
      data: {
        label: newWord,
      },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  // external drops
  const onDragOver = useCallback(
    (event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";

      let position = screenToFlowPosition({
        x: event.clientX - 150,
        y: event.clientY - 40,
      });
      const rect = {
        x: position.x,
        y: position.y,
        width: 150,
        height: 40,
      };

      const intersections = getIntersectingNodes(rect).map((n) => n.id);

      setNodes((ns) =>
        ns.map((n) => ({
          ...n,
          className: intersections.includes(n.id) ? "highlight" : "",
        }))
      );
    },
    [screenToFlowPosition]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const content = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof content === "undefined" || !content) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX - 150,
        y: event.clientY - 40,
      });
      const newNode = {
        id: getId(),
        type: "node-toolbar",
        position,
        positionAbsolute: position,
        data: { label: `${content}` },
        height: 40,
        width: 173,
      };

      setNodes((nds) => nds.concat(newNode));

      setTimeout(() => {
        const intersections = getIntersectingNodes(newNode);
        if (intersections.length) combineTwoNodesInOne(newNode, intersections);
      }, 20);
    },
    [screenToFlowPosition]
  );

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          className="intersection-flow"
          nodes={nodes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          edges={edges}
          edgeTypes={edgeTypes}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          fitView
          selectNodesOnDrag={false}
          onPaneClick={onPaneClick}
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
      <Sidebar />
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
