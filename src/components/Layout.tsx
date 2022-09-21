const Layout = ({ children }) => {
  return (
    <div className="relative flex flex-col h-full w-full overflow auto font-primary text-white bg-main">
      {children}
    </div>
  );
};

export default Layout;
