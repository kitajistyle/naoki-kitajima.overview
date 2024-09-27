"use client";

import { Dialog, DialogPanel, PopoverGroup } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="fixed w-full items-center justify-between bg-[#189f43] transition-transform transform z-50">
      <nav
        aria-label="Global"
        className="flex w-full items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <span className="sr-only">Your Company</span>
          <Link href="/">
            <p className="font-bold text-lg text-white">Naoki Portfolio</p>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="h-6 w-6 text-white" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-12">
          <a
            href="#Profile"
            className="text-sm font-semibold leading-6 text-white"
          >
            Profile
          </a>
          <a
            href="#Skills"
            className="text-sm font-semibold leading-6 text-white"
          >
            Skills
          </a>
          <a
            href="#Works"
            className="text-sm font-semibold leading-6 text-white"
          >
            Works
          </a>
          <a
            href="#Active"
            className="text-sm font-semibold leading-6 text-white"
          >
            Active
          </a>
        </PopoverGroup>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="kitajimanaoki.0917@gmail.com" className="text-sm font-semibold leading-6 text-white">
            Contact <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <p className="font-bold text-lg text-white">Naoki Portfolio</p>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <button type="button" onClick={() => setMobileMenuOpen(false)}>
                  <a
                    href="#Profile"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Profile
                  </a>
                  <a
                    href="#Skills"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Skills
                  </a>
                  <a
                    href="#Works"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Works
                  </a>
                  <a
                    href="#Active"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Active
                  </a>
                </button>
              </div>
              <div className="py-6">
                <a
                  href="kitajimanaoki.0917@gmail.com"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
