import {
  AuthenticatedContext,
  type AuthenticatedContextType,
} from "~/contexts/AuthenticatedContext";
import { authClient } from "~/lib/auth-client";
// import { Link, useRouter } from "@tanstack/react-router";
import { LayoutDashboard, Scale, UsersRound } from "lucide-react";
import { useContext } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { href, Link, useNavigate } from "react-router";

const links = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: href("/dashboard"),
  },
  {
    name: "Teams",
    icon: UsersRound,
    href: href("/teams"),
  },
  {
    name: "Rules",
    icon: Scale,
    // href: "/rules",
    href: href("/rules"),
  },
];

export default function Header() {
  const navigate = useNavigate();
  const { userData } = useContext(
    AuthenticatedContext
  ) as AuthenticatedContextType;

  const handleLogout = async () => {
    await authClient.signOut();
    navigate(href("/"));
    // router.navigate({
    //   to: "/",
    // });
  };

  return (
    <header className="flex flex-row justify-between items-center w-full py-5 px-10 border-b-[1px] ">
      <div className="flex flex-row justify-start items-center">
        <img
          src={
            new URL(
              "../../public/infinity-logo-sash-embroidered.png",
              import.meta.url
            ).href
          }
          width={48}
          style={{
            filter:
              "brightness(0) saturate(100%) invert(21%) sepia(88%) saturate(2794%) hue-rotate(252deg) brightness(83%) contrast(96%)",
          }}
        />
        {links.map((link) => (
          <Link to={link.href} key={link.name} className="ml-6">
            <Button
              variant="secondary"
              className="flex flex-row justify-center items-center w-full hover:cursor-pointer"
            >
              <link.icon className="mr-2" />
              {link.name}
            </Button>
          </Link>
        ))}
      </div>
      <div className="flex flex-row gap-2">
        <Avatar>
          <AvatarImage src={userData?.user.image} alt={userData?.user.name} />
        </Avatar>
        <Button
          variant={"destructive"}
          className="hover:cursor-pointer"
          onClick={handleLogout}
        >
          Sign Out
        </Button>
      </div>
    </header>
  );
}
