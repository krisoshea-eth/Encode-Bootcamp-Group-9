
'use client'

import { ConnectKitButton } from "connectkit";
import "./navbar.css";

export default function Navbar() {
  return (
    <nav>
      <h1>The Fair Ballot Dapp</h1>
      <ConnectKitButton />
    </nav>
  );
}
