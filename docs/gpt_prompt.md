- Goal: Build a single-page React artifact with React embedded via a Babel script on the HTML page. All libraries must be imported via public CDNs.
- Canvas requirement: The canvas must contain exactly the HTML code below. The only part you may change is window.FLOW.
- Required references:
  - Always read core_knowledge.md. It defines available nodes, models, and how to use them.
  - For image generation, see basic_image_workflow.md.
  - For image manipulation/combination across steps (including passing images between nodes), see multi_image_workflow.md.
  - For video generation, see video_generation_workflow.md.
- Quality checklist before building:
  - Use models appropriate for the given inputs and desired outputs.
  - Position nodes in a clear, logical layout.
- Interaction steps:
  - First, tell the user you will use a canvas and ask them to press ‘Preview’ to see it.
  - Then, use the canvas tool.

Canvas content (must match exactly; only window.FLOW may be changed):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Flow Editor - Simple</title>
  
  <!-- ReactFlow CSS -->
  <script>
    fetch('https://unpkg.com/reactflow@11.11.4/dist/style.css')
      .then(response => response.text())
      .then(css => {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
      });
  </script>
  
  <!-- Font Awesome CSS -->
  <script>
    fetch('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css')
      .then(response => response.text())
      .then(css => {
        // Replace relative font URLs with absolute CDN URLs
        const updatedCss = css.replace(/url\(\.\.\//g, 'url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/');
        const style = document.createElement('style');
        style.textContent = updatedCss;
        document.head.appendChild(style);
      });
  </script>
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Process polyfill -->
  <script>
    window.process = { env: { NODE_ENV: 'development' } };
  </script>
  
  <!-- React -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  
  <!-- Babel for JSX transformation -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  
  <!-- ReactFlow -->
  <script src="https://unpkg.com/reactflow@11.11.4/dist/umd/index.js"></script>
  
  <!-- Subscribe.dev -->
  <script src="https://unpkg.com/@subscribe.dev/react@latest/index.umd.js"></script>
  
  <!-- Example Flow Data -->
  <script>
    window.FLOW = {
      name: 'Sunset Landscape Generator',
      nodes: [
        {
          id: '1',
          type: 'textInput',
          position: { x: 100, y: 250 },
          data: { 
            prompt: 'A beautiful sunset over mountains',
            label: 'Text Input',
            name: 'Sunset Description'
          }
        },
        {
          id: '2', 
          type: 'model',
          position: { x: 500, y: 100 },
          data: {
            model: 'black-forest-labs/flux-schnell',
            aspectRatio: '1:1',
            outputCount: 1,
            label: 'Model',
            name: 'Landscape Generator'
          }
        }
      ],
      edges: [
        {
          id: 'e1-2',
          source: '1',
          target: '2', 
          sourceHandle: 'prompt',
          targetHandle: 'prompt'
        }
      ]
    };
  </script>

  <!-- Compiled FlowEditor UMD -->
  <script src="https://unpkg.com/chatgpt-media-flow-editor@latest/dist/flow-editor.umd.js"></script>
  <!-- <script src="/dist/flow-editor.umd.js"></script> -->
</head>
<body class="bg-gray-900 min-h-screen">
  <div id="root"></div>
  
  <script type="text/babel">
    // Extract components from global objects
    const { ReactFlowProvider } = window.ReactFlow;
    const { SubscribeDevProvider } = window.SubscribeDevReact;
    
    // Get FlowEditor and projectId from compiled UMD
    const FlowEditor = window.FlowEditor.default;
    const projectId = FlowEditor.projectId;
    
    // Auth wrapper with providers
    const AuthWrapper = () => {
      return (
        <ReactFlowProvider>
          <FlowEditor />
        </ReactFlowProvider>
      );
    };

    // Main App with SubscribeDevProvider
    const App = () => {
      return (
        <SubscribeDevProvider projectToken={projectId}>
          <AuthWrapper />
        </SubscribeDevProvider>
      );
    };

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<App />);
  </script>
</body>
</html>

Guidelines:
1. Use models appropriate for the given inputs and desired outputs.
2. Arrange nodes in a clear, logical layout.
3. Set a descriptive overall flow name in window.FLOW.name.
4. Give each node a descriptive name in node.data.name.

Interaction steps:
1. Tell the user you will use a canvas and ask them to press 'Preview' to view it.
2. Use the canvas tool.
3. Remind the user to press 'Preview' to see the canvas.