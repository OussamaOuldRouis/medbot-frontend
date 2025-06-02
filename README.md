# Drug Insight MedBot Pro - Frontend

A modern, responsive web interface for the Drug Insight MedBot Pro system, built with React, TypeScript, and Tailwind CSS. This frontend provides an intuitive user interface for healthcare professionals to interact with the drug interaction analysis system.

## Features

- Real-time chat interface for drug interaction queries
- Markdown support for formatted medical responses
- Dark/Light mode support
- Responsive design for all device sizes
- Professional medical UI/UX
- Real-time typing indicators
- Message history
- Error handling and user feedback
- Loading states and animations

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Vite
- React Markdown
- Shadcn/ui Components
- Lucide Icons

## Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher
- Git

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd drug-insight-medbot-pro
```

2. Install dependencies:
```bash
npm install
```

3. Install additional required packages:
```bash
npm install react-markdown
npm install -D @tailwindcss/typography
```

## Configuration

The frontend is configured to connect to the backend server at `http://localhost:8001`. You can modify this in the following files:
- `src/lib/api.ts`: Update the API endpoint URL
- `src/components/Chat.tsx`: Modify chat-related configurations

## Development

1. Start the development server:
```bash
npm run dev
```

2. The application will be available at `http://localhost:5173`

## Building for Production

1. Create a production build:
```bash
npm run build
```

2. Preview the production build:
```bash
npm run preview
```

## Project Structure

```
drug-insight-medbot-pro/
├── src/
│   ├── components/     # React components
│   ├── lib/           # Utility functions and API
│   ├── styles/        # Global styles
│   └── App.tsx        # Main application component
├── public/            # Static assets
├── index.html         # Entry HTML file
└── package.json       # Project dependencies
```

## Key Components

- `Chat.tsx`: Main chat interface component
- `Message.tsx`: Individual message component
- `api.ts`: API integration with backend
- `types.ts`: TypeScript type definitions

## Styling

The project uses Tailwind CSS for styling with the following features:
- Custom color scheme
- Dark mode support
- Responsive design
- Typography plugin for markdown content
- Custom animations and transitions

## API Integration

The frontend communicates with the backend through the following endpoints:
- `POST /api/chat`: Send chat messages
- `GET /api/test-connection`: Test backend connectivity

## Error Handling

The application includes comprehensive error handling for:
- Network errors
- API failures
- Invalid responses
- User input validation

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization

- Code splitting
- Lazy loading
- Optimized assets
- Efficient state management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Implement proper error boundaries
- Write meaningful commit messages
- Keep components small and focused
- Use proper type definitions

## Testing

1. Run unit tests:
```bash
npm test
```

2. Run end-to-end tests:
```bash
npm run test:e2e
```

## Deployment

1. Build the application:
```bash
npm run build
```

2. Deploy the contents of the `dist` directory to your hosting service

## Environment Variables

Create a `.env` file in the root directory with the following variables:
```
VITE_API_URL=http://localhost:8001
```

## Troubleshooting

Common issues and solutions:
1. If the chat interface doesn't connect:
   - Check if the backend server is running
   - Verify the API URL configuration
   - Check network connectivity

2. If styles aren't loading:
   - Clear browser cache
   - Rebuild the application
   - Check Tailwind configuration

## License

[Add your license information here]

## Support

For support, please [add contact information or support channels]
