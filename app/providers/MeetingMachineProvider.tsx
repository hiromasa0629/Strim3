import { useMeetingMachine } from "@huddle01/react/hooks";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

interface MeetingMachineProviderProps {
  children: ReactNode;
}

export enum MeetingMachineStatus {
  Idle = "Idle",
  NotJoined = "NotJoined",
  JoiningLobby = "JoiningLobby",
  JoinedLobby = "JoinedLobby",
  JoiningRoom = "JoiningRoom",
  JoinedRoom = "JoinedRoom",
}

interface MeetingMachineContextProps {
  status: MeetingMachineStatus;
  info: any;
  peerId: string;
}

const MeetingMachineContext = createContext<MeetingMachineContextProps>(
  {} as MeetingMachineContextProps
);

const MeetingMachineProvider = (props: MeetingMachineProviderProps) => {
  const { state } = useMeetingMachine();
  const [huddle01States, setHuddle01States] =
    useState<MeetingMachineContextProps>({} as MeetingMachineContextProps);
  const { children } = props;

  useEffect(() => {
    console.log(state);
    const value = state.value;
    if (value == MeetingMachineStatus.Idle) {
      setHuddle01States({
        status: MeetingMachineStatus.Idle,
        info: {},
        peerId: "",
      });
      return;
    }
    if (typeof value === "object") {
      if (value.Initialized == MeetingMachineStatus.NotJoined) {
        setHuddle01States({
          status: MeetingMachineStatus.NotJoined,
          info: {},
          peerId: "",
        });
        return;
      }
      if (value.Initialized == MeetingMachineStatus.JoiningLobby) {
        setHuddle01States({
          status: MeetingMachineStatus.JoiningLobby,
          info: {},
          peerId: "",
        });
        return;
      }

      if (value.Initialized == MeetingMachineStatus.JoiningRoom) {
        setHuddle01States({
          status: MeetingMachineStatus.JoiningRoom,
          info: {},
          peerId: state.context.peerId,
        });
        return;
      }

      const initialized = value.Initialized;
      if (typeof initialized === "object") {
        if (initialized.JoinedLobby) {
          setHuddle01States({
            status: MeetingMachineStatus.JoinedLobby,
            info: initialized.JoinedLobby,
            peerId: state.context.peerId,
          });
          return;
        }
        if (initialized.JoinedRoom) {
          setHuddle01States({
            status: MeetingMachineStatus.JoinedRoom,
            info: initialized.JoinedRoom,
            peerId: state.context.peerId,
          });
          return;
        }
      }
    }
  }, [state.value]);

  return (
    <MeetingMachineContext.Provider value={huddle01States}>
      {children}
    </MeetingMachineContext.Provider>
  );
};

export const useMeetingMachineContext = () => useContext(MeetingMachineContext);

export default MeetingMachineProvider;
