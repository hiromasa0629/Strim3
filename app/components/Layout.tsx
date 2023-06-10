import React, { ReactNode } from "react";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import Header from "./Header";
import Head from "next/head";
import { useMeetingMachineContext } from "../providers/MeetingMachineProvider";

interface LayoutProps {
  children: ReactNode;
}

const Layout = (props: LayoutProps) => {
  const { children } = props;
  const { status, info, peerId } = useMeetingMachineContext();

  return (
    <Container className="py-3">
      <Head>
        <title>Strim3</title>
      </Head>
      <Header />
      <ToastContainer />
      <div>{status}</div>
      <div>{JSON.stringify(info)}</div>
      <div>PeerId: {peerId}</div>
      {children}
    </Container>
  );
};

export default Layout;
