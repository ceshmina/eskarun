'use client'
import { useState } from 'react'
import { slide as Menu } from 'react-burger-menu'

export default function Burger({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isOpen, setOpen] = useState(false)
  const open = () => { setOpen(true) }
  const close = () => { setOpen(false) }
  return (
    <Menu right isOpen={isOpen} onOpen={open} onClose={close} className="p-8 md:min-w-[450px] md:pr-12 text-white bg-gray-800">
      <div onClick={close} className="hidden-scrollbar">
        {children}
      </div>
    </Menu>
  )
}
