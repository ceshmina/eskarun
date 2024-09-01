'use client'
import { slide as Menu } from 'react-burger-menu'

export default function Burger({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <Menu right className="p-8 text-white bg-gray-800">
      {children}
    </Menu>
  )
}
