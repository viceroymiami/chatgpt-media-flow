# AI image & video workflows editor built inside of ChatGPT artifact

A visual node-based editor for creating AI workflows with ReactFlow, Replicate, and Subscribe.dev integration. Users can create workflows by talking to ChatGPT.

On the roadmap: supporting a lot more AI models and API providers

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Then open `http://localhost:8000` in your browser to see the main AI Flow Editor application.

## Features

- **Visual Workflow Editor** - Drag-and-drop interface for creating AI workflows
- **Multiple AI Models** - Support for image generation, video generation, and text models
- **Node-based Connections** - Visual connections between inputs, models, and outputs
- **User Authentication** - Integrated Subscribe.dev authentication and billing
- **Real-time Execution** - Execute workflows with live progress tracking
- **Generation History** - Track all previous AI generations with persistent history
- **Professional UI** - Clean interface with Phosphor icons and proper aspect ratios
- **UMD Format** - Works in any JavaScript environment with no external dependencies
- **Programmatic Initialization** - Load predefined workflows via window.FLOW

## Installation

```bash
npm install @chatgpt-media-flow/editor
```

## Prerequisites

Before using the Flow Editor, make sure you have the following dependencies loaded:

```html
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
<script>
  // Load ReactFlow CSS dynamically
  fetch('https://unpkg.com/reactflow@11.11.4/dist/style.css')
    .then(response => response.text())
    .then(css => {
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
    });
</script>

<!-- Subscribe.dev -->
<script src="https://unpkg.com/@subscribe.dev/react@0.0.161/index.umd.js"></script>

<!-- Tailwind CSS (for styling) -->
<script src="https://cdn.tailwindcss.com"></script>
```

**Note:** The Flow Editor includes all necessary icons internally - no external icon libraries are required.

## Usage

### ES Modules / React App

```tsx
// Note: This package is primarily designed for UMD usage
// ES module support may be limited in the current version
import FlowEditor from '@chatgpt-media-flow/editor';

function App() {
  return (
    <FlowEditor 
      projectToken="your-subscribe-dev-project-token"
    />
  );
}

export default App;
```

### UMD / Script Tag

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Prerequisites (see above) -->
  
  <!-- Flow Editor -->
  <script src="https://unpkg.com/@chatgpt-media-flow/editor@latest/dist/flow-editor.umd.js"></script>
</head>
<body>
  <div id="flow-editor-container"></div>
  
  <script type="text/babel">
    // FlowEditor is available as window.FlowEditor
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

    const root = ReactDOM.createRoot(document.getElementById('flow-editor-container'));
    root.render(<App />);
  </script>
</body>
</html>
```

### Programmatic Initialization

You can initialize the Flow Editor with predefined nodes and edges by setting `window.FLOW` before the component mounts:

```html
<script>
  window.FLOW = {
    nodes: [
      {
        id: '1',
        type: 'textInput',
        position: { x: 100, y: 250 },
        data: { 
          prompt: 'A beautiful sunset over mountains',
          label: 'Text Input'
        }
      },
      {
        id: '2', 
        type: 'model',
        position: { x: 500, y: 100 },
        data: {
          model: 'black-forest-labs/flux-schnell',
          width: 1024,
          height: 1024,
          outputCount: 2,
          label: 'Model'
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
```

## API Reference

### FlowEditor Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `projectToken` | `string` | No | - | Your Subscribe.dev project token (can be set via SubscribeDevProvider) |

**Note:** The FlowEditor is typically wrapped with `SubscribeDevProvider` which handles authentication and API configuration.

## Supported AI Models

The Flow Editor supports various AI models through Subscribe.dev:

### Image Models
- **Flux Schnell** (`black-forest-labs/flux-schnell`) - Fast image generation with aspectRatio support (1:1, 16:9, 9:16)
- **Google Nano Banana** (`google/nano-banana`) - Combines two input images with prompt

### Video Models
- **WAN Video** (`wan-video/wan-2.2-5b-fast`) - Video generation with optional starting frame (16:9, 9:16)
- **Seedance Lite** (`bytedance/seedance-1-lite`) - High quality video with optional start/end frames (1:1, 16:9, 9:16)
- **Seedance Pro** (`bytedance/seedance-1-pro`) - Premium video generation (1:1, 16:9, 9:16)

### Language Models
- **GPT-4o** (`openai/gpt-4o`) - Text generation with optional image input
- **GPT-5** (`openai/gpt-5`) - Advanced text generation with optional image input

### Voice Models
- **Minimax Speech** (`minimax/speech-02-turbo`) - Text-to-speech with 40+ English voice options

### Lipsync Models
- **Sync Lipsync** (`sync/lipsync-2`) - Synchronizes audio with video

## Workflow Components

### Input Nodes
- **Text Input** - For text prompts and instructions
- **Image Input** - For image uploads and references

### Model Nodes
- **AI Models** - Execute AI generation with configurable parameters
- Support for multiple outputs (1-8 per model)
- Real-time progress tracking
- Parameter controls (width, height, aspect ratio, etc.)

### Connections
- Visual connections between compatible node types
- Automatic type validation
- Support for multiple outputs connecting to multiple inputs

## Key Features

### Generation History
- Track all previous AI generations automatically
- Persistent history across sessions
- Modal view with generation details
- One-click access to previous results

### Authentication & Billing
- Integrated Subscribe.dev authentication
- Credit usage tracking
- Subscription management
- Sign in/out functionality

### Workflow Execution
- Topological sorting for correct execution order
- Parallel output generation
- Real-time status updates
- Error handling and retry logic

### User Interface
- Dark theme optimized for AI workflows
- Professional Phosphor icon set
- Proper aspect ratios for media previews
- Keyboard shortcuts (Delete/Backspace to remove nodes/edges)
- Hover controls for node management
- Minimap and zoom controls
- Clickable media outputs with copy functionality

## Development

To work on this package locally:

```bash
# Clone the repository
git clone https://github.com/viceroymiami/chatgpt-media-flow.git

# Install dependencies  
npm install

# Start development server (builds and serves with file watching)
npm run dev
```

This will:
1. Build the flow-editor UMD bundle
2. Start webpack in watch mode (rebuilds on file changes)
3. Start a local server on `http://localhost:8000`

### Running the Main App

Once the development server is running, open your browser to:

**`http://localhost:8000`** 

This is the main AI Flow Editor application with a pre-configured workflow demonstrating:
- Text input nodes
- AI model nodes (Flux Schnell for image generation)
- Visual node connections
- Real-time workflow execution
- Multiple output generation

### Other Available Commands

```bash
# Build once (without serving)
npm run build

# Serve existing build (without rebuilding)
npm run serve

# Build once and serve (no file watching)
npm run dev:serve

# Build for production
NODE_ENV=production npm run build
```

### Main Example

The development server hosts the main example implementation:

- `http://localhost:8000` - Main AI Flow Editor with predefined workflow demonstrating text input → image generation

**Note:** The UMD bundle is built automatically when you run `npm run dev`.

## Subscribe.dev Integration

This package requires a Subscribe.dev account and project token. Get started at [subscribe.dev](https://subscribe.dev):

1. Sign up for a Subscribe.dev account
2. Create a new project
3. Copy your project token
4. Use it in the `projectToken` prop

## License

MIT

## Support

For issues and feature requests, please use the [GitHub Issues](https://github.com/viceroymiami/chatgpt-media-flow/issues) page.
