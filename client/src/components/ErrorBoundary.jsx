import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <h2 className="font-display text-3xl">Something went wrong</h2>
          <p className="mt-3 text-sm text-bean/70 dark:text-milk/70">
            {this.state.error?.message || 'An unexpected error occurred while loading this page.'}
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ hasError: false, error: null })
              window.location.reload()
            }}
            className="mt-6 rounded-full bg-espresso px-6 py-2.5 text-sm font-semibold text-milk transition hover:opacity-85 dark:bg-milk dark:text-espresso"
          >
            Reload page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
