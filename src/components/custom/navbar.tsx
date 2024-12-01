"use client"

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import Link from "next/link";
import Image from "next/image";
import logo from  "../../pictures/pc_logo.png"
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-500 shadow-md z-50 mb-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" passHref>
              <Image
                src={logo}
                width={50}
                height={50}
                alt=""
              />
          </Link>
          <NavigationMenu className="container mx-auto py-2">
            <NavigationMenuList>
              {isAdmin ? (
                <>
                <NavigationMenuItem >
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/admin/adminworkers">             
                        Workers
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/admin/adminpets">
                        Pets
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/admin/adminschedules">
                        Schedules
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                    <Link href="/logout">
                        Logout
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                </>
              ) : (
                <>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link href="/adoption">             
                          Adoption
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link href="/bringin">
                          Bring in
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link href="/walk">
                          Walk
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                      <Link href="/camp">
                          Camp
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;