import { ProfileWithTypedSkills } from "@/server/models/user.schema";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { signIn, signOut } from "@/lib/auth-client";

type Props = {
  editable: boolean;
  portofolio: ProfileWithTypedSkills
}

export default function LoginStateLabel({ portofolio }: Props) {
  return (
    <div className="fixed bottom-4 left-4  text-3xl font-bold z-10">
      <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 flex flex-col gap-2">
        {portofolio.loginUser && <Popover>
          <PopoverTrigger asChild>
            <Button type="button" className="cursor-pointer">
              {portofolio.loginUser}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-50" side="top" align="start">
            <button type="button" className="p-2 cursor-pointer" onClick={() => signOut()}>
              Logout
            </button>
          </PopoverContent>
        </Popover>}

        {!portofolio.loginUser && <Button type="button" className="cursor-pointer" onClick={async () => {
          await signIn(`/${portofolio.username}`);
        }}>
          Login
        </Button>}
      </div>
    </div>
  );
}
