import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center p-8">
          <div className="max-w-lg rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
            <h2 className="text-xl font-bold text-destructive mb-2">Error al cargar la página</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {this.state.error.message}
            </p>
            <pre className="text-xs text-left bg-muted rounded-lg p-4 overflow-auto max-h-48">
              {this.state.error.stack}
            </pre>
            <button
              type="button"
              onClick={() => this.setState({ error: null })}
              className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
            >
              Reintentar
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
