import { TbBeach, TbMountain } from "react-icons/tb";
import {
  GiWindmill,
} from "react-icons/gi";
import {
  FaPumpSoap,
  FaShower,
  FaFireExtinguisher,
  FaUmbrellaBeach,
  FaKey,
} from "react-icons/fa";
import { FaHouseUser, FaKitchenSet } from "react-icons/fa6";
import { IoBusiness, IoBarChart } from "react-icons/io5";
import { GiPayMoney } from "react-icons/gi";
import { FaDonate } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { GiCheckMark } from "react-icons/gi";

import {
  BiSolidWasher,
  BiSolidDryer,
  BiSolidFirstAid,
  BiWifi,
  BiSolidFridge,
  BiWorld,
} from "react-icons/bi";
import { BsSnow, BsFillDoorOpenFill, BsPersonWorkspace } from "react-icons/bs";
import { MdOutlineVilla, MdMicrowave, MdBalcony, MdYard, MdPets } from "react-icons/md";
import {
  PiBathtubFill,
  PiCoatHangerFill,
  PiTelevisionFill,
} from "react-icons/pi";
import { TbIroning3 } from "react-icons/tb";
import {
  GiHeatHaze,
  GiCctvCamera,
  GiBarbecue,
  GiToaster,
  GiCampfire,
} from "react-icons/gi";
import { AiFillCar } from "react-icons/ai";

export const categories = [
  {
    label: "All",
    icon: <BiWorld />,
  },
  {
    img: "assets/tower3.jpg",
    label: "Fund Manager",
    icon: <IoBarChart style={{ color: '#6441a5' }} />, 
    description: "This property is close to the beach!",
  },
  {
    img: "assets/unity.jpg",
    label: "Non-Profit",
    icon: <FaDonate style={{ color: '#0f9b0f' }}/>,
    description: "This property is in the countryside!",
  },
  {
    img: "assets/tower2.jpg",
    label: "Investor",
    icon: <IoBusiness style={{ color: '#c33764' }} />, 
    description: "This property has windmills!",
  },
];

export const types = [
  {
    name: "CMA Certified",
    description: "I have been approved by the Capital Markets Authority to manage funds and have no problem availing necessary documents to prove this when needed",
    icon: <GiCheckMark />,
  },
  {
    name: "Not CMA Certified",
    description:
      "I have NOT been approved by the Capital Markets Authority to manage funds and all my management is based on experience",
    icon: <RxCross2 />
    ,
  },

];

export const projectHighlights = [
  {
    aboutIcon: "",
    aboutTitle: "Host"
  },
  {
    aboutIcon: "",
    aboutTitle: "Target"
  },
  {
    aboutIcon: "",
    aboutTitle: "Returns"
  },
  {
    aboutIcon: "",
    aboutTitle: "Bid Expiry"
  },
]

export const facilities = [
  {
    name: "Bath tub",
    icon: <PiBathtubFill />,
  },
  {
    name: "Personal care products",
    icon: <FaPumpSoap />,
  },
  {
    name: "Outdoor shower",
    icon: <FaShower />,
  },
  {
    name: "Washer",
    icon: <BiSolidWasher />,
  },
  {
    name: "Dryer",
    icon: <BiSolidDryer />,
  },
  {
    name: "Hangers",
    icon: <PiCoatHangerFill />,
  },
  {
    name: "Iron",
    icon: <TbIroning3 />,
  },
  {
    name: "TV",
    icon: <PiTelevisionFill />,
  },
  {
    name: "Dedicated workspace",
    icon: <BsPersonWorkspace />
  },
  {
    name: "Air Conditioning",
    icon: <BsSnow />,
  },
  {
    name: "Heating",
    icon: <GiHeatHaze />,
  },
  {
    name: "Security cameras",
    icon: <GiCctvCamera />,
  },
  {
    name: "Fire extinguisher",
    icon: <FaFireExtinguisher />,
  },
  {
    name: "First Aid",
    icon: <BiSolidFirstAid />,
  },
  {
    name: "Wifi",
    icon: <BiWifi />,
  },
  {
    name: "Cooking set",
    icon: <FaKitchenSet />,
  },
  {
    name: "Refrigerator",
    icon: <BiSolidFridge />,
  },
  {
    name: "Microwave",
    icon: <MdMicrowave />,
  },
  {
    name: "Stove",
    icon: <GiToaster />,
  },
  {
    name: "Barbecue grill",
    icon: <GiBarbecue />,
  },
  {
    name: "Outdoor dining area",
    icon: <FaUmbrellaBeach />,
  },
  {
    name: "Private patio or Balcony",
    icon: <MdBalcony />,
  },
  {
    name: "Camp fire",
    icon: <GiCampfire />,
  },
  {
    name: "Garden",
    icon: <MdYard />,
  },
  {
    name: "Free parking",
    icon: <AiFillCar />,
  },
  {
    name: "Self check-in",
    icon: <FaKey />
  },
  {
    name: " Pet allowed",
    icon: <MdPets />
  }
];
