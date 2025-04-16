"use client"

import { useState } from "react";
import PostUserName from "../templates/PostUserName/PostUserName";
import WelcomeMessage from "./welcomeMessage";

export default function WelocomeWrapper() {

  const [step, setStep] = useState(1)
  const [username, setUsername] = useState("")

  const changeStep = () => setStep(2)
  const getUsername = (name: string) => setUsername(name)

  return (
    <div>
      {step === 1 && <PostUserName
        changeStep={changeStep}
        getUsername={getUsername}
      />}
      {step === 2 && <WelcomeMessage
        username={username}
      />}
    </div>
  );
}
