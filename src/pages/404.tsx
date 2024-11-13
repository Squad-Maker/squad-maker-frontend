import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

import { useTheme } from '@/components/theme/theme-provider';

import error404 from '../assets/error404.svg';
import error404Dark from '../assets/error404Dark.svg';

export function NotFound() {
  const { theme } = useTheme();
  
  return (
    <div className="flex h-screen flex-col sm:flex-row bg-background items-center justify-center gap-2 space-y-4">
      <div className='flex items-center justify-center px-4'>
        <img className='w-[75%] sm:w-full items-center' src={theme == 'light' ? error404Dark : error404} alt="Imagem erro 404" /> 
      </div>
      <div className='px-9 text-center sm:text-left'>
        <p className="mb-4 text-xl font-bold md:text-3xl">Houston, temos um problema!</p>
        <p className="mb-4 text-lg font-normal text-muted-foreground">
          Parece que esta página foi engolida por um buraco negro. Tente outra rota!
        </p>
        <Button asChild>
          <Link to="/">Voltar à página inicial</Link>
        </Button>
      </div>
    </div>
  )
}
