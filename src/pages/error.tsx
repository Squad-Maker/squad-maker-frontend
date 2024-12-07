import { Link, useRouteError } from 'react-router-dom'

import errorImg from '@/assets/error.svg'
import errorDark from '@/assets/errorDark.svg'
import { useTheme } from '@/components/theme/theme-provider'
import { Button } from '@/components/ui/button'

export function ErrorPage() {
  const error = useRouteError() as Error
  const { theme } = useTheme()

  return (
    <div className="flex h-screen flex-col sm:flex-row bg-background items-center justify-center gap-2 space-y-4">
      <div className="flex items-center justify-center px-4">
        <img
          className="w-[75%] sm:w-full items-center"
          src={theme === 'light' ? errorImg : errorDark}
          alt="Imagem erro 404"
        />
      </div>
      <div className="px-9 text-center sm:text-left">
        <p className="mb-4 text-xl font-bold md:text-3xl">
          Houston, estamos fora de órbita!
        </p>
        <p className="mb-4 text-lg font-normal text-muted-foreground">
          Parece que esta página teve alguns problemas, veja com mais detalhes
          abaixo:
        </p>
        <pre className="mb-4 text-lg font-normal text-muted-foreground">
          {error?.message || JSON.stringify(error)}
        </pre>
        <Button asChild>
          <Link to="/">Voltar à página inicial</Link>
        </Button>
      </div>
    </div>
  )
}
