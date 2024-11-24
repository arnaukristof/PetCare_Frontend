import React from 'react'

import {
  NavigationMenu,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { Link } from '@radix-ui/react-navigation-menu'

const Navbar = () => {
  return (
    <NavigationMenu className="container mx-auto py-10">
      <Link href="/" >
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          Home
        </NavigationMenuLink>
      </Link>
      <Link href="/admin/adminworkers">
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          Workers
        </NavigationMenuLink>
      </Link>
      <Link href="/admin/adminpets">
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          Pets
        </NavigationMenuLink>
      </Link>
      <Link href="/admin/adminschedules">
        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
          Schedules
        </NavigationMenuLink>
      </Link>
    </NavigationMenu>
  )
}

export default Navbar