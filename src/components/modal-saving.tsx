'use client'
import { CircleCheck } from 'lucide-react'

interface ModalSavingProps {
  status: string
  messageLoad?: string
  messageSuccess?: string
}

export default function ModalSaving(props: ModalSavingProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {props.status === 'loading' ? (
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 shadow-lg w-3/5 md:w-1/5 flex items-center justify-center flex-wrap gap-4">
          <div className="w-10 h-10 border-4 border-zinc-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2">
            {props.messageLoad
              ? props.messageLoad
              : 'Estamos salvando suas informações'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-800 rounded-xl p-8 shadow-lg w-3/5 md:w-1/5 flex items-center justify-center flex-wrap gap-4">
          <CircleCheck className="h-10 w-10" />
          <p>
            {props.messageSuccess ? props.messageSuccess : 'Alterações salvas'}
          </p>
        </div>
      )}
    </div>
  )
}
