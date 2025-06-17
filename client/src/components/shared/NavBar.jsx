import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

const navLinks = [
  { name: "Home", href: "/" },
  { 
    name: "Discover", 
    subLinks: [
      { name: "Discover Partners", href: "/discover-partners" },
      { name: "Discover Speakers", href: "/discover-speakers" },
      { name: "Get Involved", href: "/get-involved" },
    ],
  },
  { name: "Events", href: "/events" },
  { name: "About Us", href: "/aboutus" },
];

const NavBar = () => {
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [discoverDropdown, setDiscoverDropdown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowNav(currentScrollY < lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {showNav && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed top-0 left-0 w-full z-50 bg-red-500 text-white px-4 sm:px-6 py-10 shadow-md rounded-b-[50px]"
        >
          <div className="container mx-auto flex items-center justify-center relative">
            {/* Desktop Navigation */}
            <div className="hidden md:flex justify-center items-center space-x-8 lg:space-x-12 text-xl font-bold">
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative group"
                  onMouseEnter={() => link.subLinks && setDiscoverDropdown(true)}
                  onMouseLeave={() => link.subLinks && setDiscoverDropdown(false)}
                >
                  <a
                    href={link.href}
                    className="relative inline-block transition duration-300 group-hover:text-red-800 transform group-hover:scale-105"
                  >
                    {link.name}
                    <span className="block h-0.5 bg-red-800 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left group-hover:shadow-[0_0_8px_rgba(236,72,153,0.5)]" />
                  </a>
                  {link.subLinks && (
                    <AnimatePresence>
                      {discoverDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute left-0 mt-3 w-52 bg-red-500 shadow-xl rounded-lg py-3 border border-white/60 backdrop-blur-md"
                        >
                          {link.subLinks.map((subLink) => (
                            <a
                              key={subLink.name}
                              href={subLink.href}
                              className="block px-4 py-2 text-sm font-medium text-white hover:bg-white/10 hover:text-red-800 hover:border-l-4 hover:border-red-800 transition-all duration-200 transform hover:scale-105"
                              onClick={() => setMenuOpen(false)}
                            >
                              {subLink.name}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Contact Button */}
            <div className="hidden md:block absolute right-4 sm:right-6">
              <a
                href="/contact"
                className="bg-white text-red-500 text-lg px-6 py-2 rounded-full font-bold hover:bg-red-800 hover:text-white hover:shadow-[0_0_12px_rgba(236,72,153,0.6)] transition-all duration-300 transform hover:scale-105 backdrop-blur-md border-2 border-white"
              >
                Contact Us
              </a>
            </div>

            {/* Mobile Arrow Icon */}
            <div className="md:hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200 backdrop-blur-md"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                {menuOpen ? <FiChevronUp size={28} /> : <FiChevronDown size={28} />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="md:hidden mt-4 px-4 pb-4 flex flex-col gap-2 border-t-2 border-white/60 pt-4 bg-red-500/90 backdrop-blur-md rounded-b-[30px]"
              >
                {navLinks.map((link) => (
                  <div key={link.name}>
                    <motion.a
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block py-2 text-lg font-bold text-white hover:text-red-800 transition-all duration-200 transform hover:scale-105 hover:shadow-[0_0_4px_rgba(236,72,153,0.3)]"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {link.name}
                    </motion.a>
                    {link.subLinks && (
                      <div className="pl-4 mt-1 flex flex-col gap-1">
                        {link.subLinks.map((subLink) => (
                          <a
                            key={subLink.name}
                            href={subLink.href}
                            onClick={() => setMenuOpen(false)}
                            className="block py-1 text-md font-medium text-white hover:text-red-800 transition-all duration-200 transform hover:scale-105"
                          >
                            {subLink.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <a
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="mt-4 bg-white text-red-500 text-center text-lg px-6 py-2 rounded-full font-bold hover:bg-red-800 hover:text-white hover:shadow-[0_0_12px_rgba(236,72,153,0.6)] transition-all duration-300 transform hover:scale-105 border-2 border-white"
                >
                  Contact Us
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default NavBar;