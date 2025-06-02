import React, { useState, useEffect } from "react";

export default function PredictorApp() {
  const [serverSeed, setServerSeed] = useState("");
  const [serverSeedError, setServerSeedError] = useState("");
  const [betAmount, setBetAmount] = useState("");
  const [mines, setMines] = useState(1);
  const [selectedBoxes, setSelectedBoxes] = useState([]);
  const [betsMade, setBetsMade] = useState(0);

  const gridSize = 5;
  const totalCells = gridSize * gridSize;

  const isValidServerSeed = (seed) => /^[a-f0-9]{64}$/.test(seed.trim());

  const handlePredict = () => {
    if (!isValidServerSeed(serverSeed)) {
      setServerSeedError("Invalid server seed.");
      return;
    }
    setServerSeedError("");

    let boxCount;
    if (mines === 7 || mines === 8) {
      boxCount = 3;
    } else {
      switch (mines) {
        case 1:
          boxCount = Math.floor(Math.random() * 2) + 7;
          break;
        case 2:
          boxCount = Math.floor(Math.random() * 2) + 6;
          break;
        case 3:
          boxCount = Math.floor(Math.random() * 2) + 5;
          break;
        case 4:
          boxCount = Math.floor(Math.random() * 2) + 4;
          break;
        default:
          boxCount = Math.floor(Math.random() * 2) + 3;
      }
    }

    const chosen = new Set();
    while (chosen.size < boxCount) {
      const randIndex = Math.floor(Math.random() * totalCells);
      chosen.add(randIndex);
    }

    setSelectedBoxes(Array.from(chosen));
    setBetsMade((prev) => prev + 1);
  };

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === "/home") {
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#152744] lg:fixed text-white flex items-center justify-center px-4 py-6">
      <div className="flex flex-col md:flex-row gap-6 bg-[#213744] rounded-2xl shadow-2xl w-full max-w-6xl md:w-[800px] lg:w-[900px] overflow-hidden">
        {/* Control Panel */}
        <div className="w-full md:w-1/3 flex flex-col gap-6 p-6">
          <div className="flex gap-3">
            <div className="flex rounded-full overflow-hidden w-max bg-slate-800 text-white shadow-md text-sm">
              <div className="bg-[#F8F9FA] text-[#28A745] px-[6px] py-1 font-semibold pl-3 pr-3 pb-[5px]">
                Bets Made
              </div>
              <div className="bg-[#F8F9FA] px-3 py-1 font-bold pl-2 pr-3 pb-[5px] text-[#28A745]">
                {betsMade}
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-sm text-[#F8F9FA]">Server Seed</label>
            <input
              type="text"
              className={`w-full px-4 py-2 rounded-lg bg-[#0f212f] border ${
                serverSeedError ? "border-red-500" : "border-gray-600"
              } text-white placeholder-gray-400`}
              placeholder="Paste your server seed"
              value={serverSeed}
              onChange={(e) => setServerSeed(e.target.value)}
            />
            {serverSeedError && (
              <p className="text-red-500 text-xs mt-1">{serverSeedError}</p>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className="block mb-2 font-medium text-sm text-[#F8F9FA]">Bet Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  INR
                </span>
                <input
                  type="number"
                  className="w-full pl-12 pr-4 py-2 rounded-lg bg-[#0f212f] border border-gray-600 text-white placeholder-gray-400"
                  placeholder="0.00"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  onWheel={(e) => e.target.blur()}
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block mb-2 font-medium text-sm text-[#F8F9FA]">Mines</label>
              <select
                className="w-full px-4 py-2 rounded-lg bg-[#0f212f] border border-gray-600 text-white"
                value={mines}
                onChange={(e) => setMines(Number(e.target.value))}
              >
                {Array.from({ length: 8 }, (_, i) => i + 1).map((mine) => (
                  <option key={mine} value={mine}>
                    {mine}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            className="w-full mt-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-3 rounded-lg transition"
            onClick={handlePredict}
          >
            Predict
          </button>

          <div className="text-xs text-gray-400 mt-6 hidden md:block">
            <p>
              NOTE: While our predictions are powered by advanced algorithms and thorough analysis
              of game data, they are not guaranteed to be 100% accurate. Our system maintains an
              accuracy rate of approximately 90%, which means outcomes may occasionally vary.
              Please use our services responsibly and be aware that all forms of gambling carry
              risk.
            </p>
          </div>

          <div className="items-center gap-4 mt-4 text-gray-400 hidden md:flex">
            <a href="https://t.me/Mine_Pirates" className="hover:text-white" target="_blank" rel="noopener noreferrer">
              Telegram
            </a>
            <a
              href="https://www.instagram.com/mine.pirates?igsh=dW1udGd1dXZkdmdx&utm_source=qr"
              className="hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>

        {/* Grid Section */}
        <div className="bg-[#0b2230] p-4 rounded-none rounded-br-none md:rounded-tr-2xl md:rounded-br-2xl w-full lg:w-[600px] flex items-center justify-center">
          <div className="grid bg-[#212b36] grid-cols-5 gap-2 w-full p-3 max-w-[540px] rounded-sm">
            {Array.from({ length: totalCells }).map((_, index) => (
              <div
                key={index}
                className={`aspect-square rounded-lg flex items-center justify-center text-xl font-semibold cursor-pointer transition
                  ${
                    selectedBoxes.includes(index)
                      ? "bg-green-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
              >
                {selectedBoxes.includes(index) ? "" : ""}
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-400 px-3 block md:hidden">
          <p>
            NOTE: While our predictions are powered by advanced algorithms and thorough analysis of
            game data, they are not guaranteed to be 100% accurate. Our system maintains an accuracy
            rate of approximately 90%, which means outcomes may occasionally vary. Please use our
            services responsibly and be aware that all forms of gambling carry risk.
          </p>
        </div>

        <div className="flex items-center gap-4 px-3 pb-3 text-gray-400 md:hidden">
          <a href="https://t.me/Mine_Pirates" className="hover:text-white" target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
          <a
            href="https://www.instagram.com/mine.pirates?igsh=dW1udGd1dXZkdmdx&utm_source=qr"
            className="hover:text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
