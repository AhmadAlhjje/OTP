'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MessageSquareText,
  Users,
  DollarSign,
  HelpCircle,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import  useTranslation  from '@/hooks/useTranslation';

interface SidebarItemProps {
  label: string;
  icon: React.ReactNode;
  href?: string;
  subItems?: { label: string; href: string }[];
}

export default function Sidebar({ isOpen }: { isOpen: boolean }) {
  const [showSubMenu, setShowSubMenu] = useState(false);
  const { t } = useTranslation();

  const mainItems: SidebarItemProps[] = [
    {
      label: t('whatsapp_send'),
      icon: <MessageSquareText className="w-5 h-5" />,
      subItems: [
        { label: t('send_messages'), href: '/dashboard/send' },
        { label: t('from_excel'), href: '/dashboard/send/excel' },
        { label: t('from_contacts'), href: '/dashboard/send/contacts' },
      ],
    },
    {
      label: t('contacts'),
      icon: <Users className="w-5 h-5" />,
      href: '/dashboard/contacts',
    },
    {
      label: t('balance'),
      icon: <DollarSign className="w-5 h-5" />,
      href: '/dashboard/balance',
    },
    {
      label: t('help'),
      icon: <HelpCircle className="w-5 h-5" />,
      href: '/dashboard/help',
    },
  ];

  return (
    <aside
      className={`bg-[#004d40] text-white w-64 h-screen p-4 transition-transform duration-300 fixed left-0 top-0 z-40 shadow-md rtl:left-auto rtl:right-0 rtl:translate-x-full rtl:md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0`}
    >
      <nav className="space-y-2">
        {mainItems.map((item, index) => (
          <React.Fragment key={index}>
            {!item.subItems ? (
              <Link href={item.href || '#'}>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#00695c] cursor-pointer">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              </Link>
            ) : (
              <div>
                <div
                  onClick={() => setShowSubMenu(!showSubMenu)}
                  className="flex justify-between items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#00695c] cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {showSubMenu ? <ChevronDown /> : <ChevronRight />}
                </div>
                {showSubMenu && item.subItems && (
                  <div className="pl-10 mt-1 space-y-1">
                    {item.subItems.map((subItem, i) => (
                      <Link href={subItem.href} key={i}>
                        <div className="text-sm px-3 py-1 rounded-lg hover:bg-[#00796b] cursor-pointer">
                          {subItem.label}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </nav>
    </aside>
  );
}
