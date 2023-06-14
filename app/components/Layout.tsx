import React, { ReactNode } from "react";
// import { Container } from "react-bootstrap";
import { Space, message, Layout } from "antd";
import Header from "./Header";
import Head from "next/head";
import { useMeetingMachineContext } from "../providers/MeetingMachineProvider";

interface LayoutProps {
  children: ReactNode;
}

const AppLayout = (props: LayoutProps) => {
  const { children } = props;
  const { status, info, peerId } = useMeetingMachineContext();

  return (
    <>
      <Space direction="vertical" className="w-100">
        <Head>
          <title>Strim3</title>
        </Head>
        <Layout className="px-5 py-3 h-100">
          <Header />
          {/* <div>{status}</div>
          <div>{JSON.stringify(info)}</div>
          <div>PeerId: {peerId}</div> */}
          {children}
        </Layout>
      </Space>
    </>
  );
};

export default AppLayout;
