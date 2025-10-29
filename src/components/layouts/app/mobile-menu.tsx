"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

import MobileUserMenu from "./mobile-user-menu";

import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  hasAuthToken: boolean;
}

const menuItems = [
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/thu-vien", label: "Thư viện" },
  { href: "/cuoc-thi", label: "Cuộc thi" },
  { href: "/phan-anh", label: "Phản ánh" },
];

const menuVariants: Variants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const overlayVariants: Variants = {
  closed: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
  open: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
};

const itemVariants: Variants = {
  closed: {
    opacity: 0,
    x: -20,
  },
  open: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const hamburgerVariants: Variants = {
  closed: {
    rotate: 0,
  },
  open: {
    rotate: 180,
  },
};

export function MobileMenu({ hasAuthToken }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div className="md:hidden">
        <Button
          aria-label="Toggle menu"
          className="relative z-50"
          size="icon"
          variant="ghost"
          onClick={toggleMenu}
        >
          <motion.div
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.3 }}
            variants={hamburgerVariants}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </motion.div>
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              animate="open"
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              exit="closed"
              initial="closed"
              variants={overlayVariants}
              onClick={closeMenu}
            />

            {/* Mobile Menu */}
            <motion.div
              ref={menuRef}
              animate="open"
              className="fixed top-16 left-0 right-0 bg-background border-b shadow-lg z-40 md:hidden overflow-hidden"
              exit="closed"
              initial="closed"
              variants={menuVariants}
            >
              <div className="container mx-auto px-4 py-6">
                <nav className="flex flex-col space-y-4">
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      animate="open"
                      custom={index}
                      initial="closed"
                      variants={itemVariants}
                    >
                      <Link
                        className="block text-lg font-medium hover:text-[#8BC34A] transition-colors py-2 border-b border-border/50 last:border-b-0"
                        href={item.href}
                        onClick={closeMenu}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Auth Buttons */}
                <motion.div
                  animate="open"
                  className="mt-6"
                  custom={menuItems.length}
                  initial="closed"
                  variants={itemVariants}
                >
                  {!hasAuthToken ? (
                    <div className="flex flex-col space-y-3">
                      <Link href="/dang-nhap" onClick={closeMenu}>
                        <Button className="w-full" variant="outline">
                          Đăng nhập
                        </Button>
                      </Link>
                      <Link href="/dang-ky" onClick={closeMenu}>
                        <Button className="w-full" variant="default">
                          Đăng ký
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <MobileUserMenu onClose={closeMenu} />
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default MobileMenu;
