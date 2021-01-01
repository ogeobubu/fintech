import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";
import * as RiIcons from "react-icons/ri";

export const SidebarData = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <IoIcons.IoIosPaper />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "My Wallet",
        path: "/dashboard/wallet",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "Transact Bitcoin",
        path: "/dashboard/bitcoin",
        icon: <IoIcons.IoIosPaper />,
        cName: "sub-nav",
      },
      {
        title: "Redeem Gift Cards",
        path: "/dashboard/giftcard",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },
  {
    title: "My Profile",
    path: "/dashboard/profile",
    icon: <AiIcons.AiFillHome />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: "Reseller Balance",
        path: "/dashboard/wallet",
        icon: <IoIcons.IoIosPaper />,
      },
      {
        title: "Account History",
        path: "/dashboard/transactions",
        icon: <IoIcons.IoIosPaper />,
      },
    ],
  },
  {
    title: "Buy Airtime",
    path: "/dashboard/airtime",
    icon: <FaIcons.FaCartPlus />,
  },
  {
    title: "Buy Data",
    path: "/dashboard/data",
    icon: <IoIcons.IoMdPeople />,
  },
  {
    title: "TV Subscription",
    path: "/dashboard/tv_subscription",
    icon: <IoIcons.IoMdPeople />,
  },
  {
    title: "Electric Bills",
    path: "/dashboard/verify_electricity",
    icon: <IoIcons.IoMdPeople />,
  },
  // {
  //   title: "Messages",
  //   path: "/messages",
  //   icon: <FaIcons.FaEnvelopeOpenText />,

  //   iconClosed: <RiIcons.RiArrowDownSFill />,
  //   iconOpened: <RiIcons.RiArrowUpSFill />,

  //   subNav: [
  //     {
  //       title: "Message 1",
  //       path: "/messages/message1",
  //       icon: <IoIcons.IoIosPaper />,
  //     },
  //     {
  //       title: "Message 2",
  //       path: "/messages/message2",
  //       icon: <IoIcons.IoIosPaper />,
  //     },
  //   ],
  // },
  {
    title: "Sign Out",
    path: "/logout",
    icon: <IoIcons.IoMdHelpCircle />,
  },
];
