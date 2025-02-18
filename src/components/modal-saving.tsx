import { CircleCheck } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ModalSavingProps {
  status: string
  messageLoad?: string
  messageSuccess?: string
}

export default function ModalSaving({
  status,
  messageLoad,
  messageSuccess,
}: ModalSavingProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [status])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {status === 'loading' ? (
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 shadow-lg w-3/5 md:w-1/5 flex items-center justify-center flex-wrap gap-4">
          <div className="w-10 h-10 border-4 border-zinc-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-2 text-center">
            {messageLoad ?? 'Estamos salvando suas informações'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 shadow-lg w-3/5 md:w-1/5 flex items-center justify-center flex-wrap gap-4">
          <CircleCheck className="h-10 w-10" />
          <p className="text-center">{messageSuccess ?? 'Alterações salvas'}</p>
        </div>
      )}
    </div>
  )
}
