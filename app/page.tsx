import CreateUser from "@/app/component/CreateUser";
import Image from "next/image";
import DisplayUsers from "./component/DisplayUsers";

export default function Home() {
  return (
  <div><CreateUser/>
  
  <div><DisplayUsers/></div>
  </div>
  );
}
