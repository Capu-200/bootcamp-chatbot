const Background = () => {
    return (
      <div className="absolute inset-0 z-0 w-full h-full">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-red-500 to-orange-400"></div>
  
        {/* Colored Circles */}
        <div className="absolute top-[325px] right-[635px] w-52 h-52 bg-yellow-100 rounded-full blur-2xl"></div>
        <div className="absolute top-[435px] right-[435px] w-48 h-48 bg-red-200 rounded-full blur-2xl"></div>
        <div className="absolute top-40 left-0 w-56 h-56 bg-orange-100 rounded-full blur-2xl"></div>
        <div className="absolute top-0 right-0 w-[185px] h-[185px] bg-amber-200 rounded-full blur-2xl"></div>
      </div>
    );
  };
  
  export default Background;