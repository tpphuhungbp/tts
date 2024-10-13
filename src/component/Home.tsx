import React, { useState } from "react";

//############################################
//Định nghĩa interface cho typescript
//--------------------------------------------
interface VoiceOption {
  name: string;
  code: string;
}

interface URL {
  [key: string]: string;
}

interface VoiceOptions {
  [key: string]: VoiceOption[];
}
interface MAX_MIN {
  [key: string]: {
    max: number;
    min: number;
  };
}
//--------------------------------------------
//############################################

//############################################
//Định nghĩa thông tin cho mỗi API Service của ViettelAI, FPTAI, ZaloAI
//--------------------------------------------

// Base URL
const URL_SERVICE: URL = {
  ViettelAI: "https://viettelai.vn/tts/speech_synthesis",
  FPTAI: "https://api.fpt.ai/hmi/tts/v5",
  ZaloAI: "https://api.zalo.ai/v1/tts/synthesize",
};

// Tốc độ lớn nhất - bé nhất
const MAX_MIN_SERVICE: MAX_MIN = {
  ViettelAI: {
    max: 1.2,
    min: 0.8,
  },
  FPTAI: { max: 3, min: -3 },
  ZaloAI: { max: 1.2, min: 0.8 },
};

//format request ở 3 services API
const serviceAPI = (
  serviceName: string,
  apiKey: string,
  voiceCode: string,
  speed: string,
  text: string
) => {
  switch (serviceName) {
    case "ViettelAI":
      return {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text,
          voice: voiceCode,
          speed: parseFloat(speed),
          tts_return_option: 2,
          without_filter: false,
          token: apiKey,
        }),
      };
    case "FPTAI":
      const newHeaderFPT: HeadersInit = new Headers();
      newHeaderFPT.set("api-key", apiKey);
      newHeaderFPT.set("speed", speed);
      newHeaderFPT.set("voice", voiceCode);
      return {
        method: "POST",
        headers: newHeaderFPT,
        body: text,
      };
    case "ZaloAI":
      const newHeaderZalo: HeadersInit = new Headers();
      newHeaderZalo.set("apikey", apiKey);
      newHeaderZalo.set("Content-Type", "application/x-www-form-urlencoded");

      const zaloBody = new URLSearchParams();
      zaloBody.append("input", text);
      zaloBody.append("speaker_id", voiceCode);
      zaloBody.append("speed", speed);

      return {
        method: "POST",
        headers: newHeaderZalo,
        body: zaloBody,
      };
    default:
      return {};
  }
};

//Danh sách các loại giọng
const serviceVoiceOptions: VoiceOptions = {
  ViettelAI: [
    {
      name: "Quỳnh Anh (Nữ miền Bắc)",
      code: "hn-quynhanh",
    },
    {
      name: "Diễm My (Nữ miền Nam)",
      code: "hcm-diemmy",
    },
    {
      name: "Mai Ngọc (Nữ miền Trung)",
      code: "hue-maingoc",
    },
    {
      name: "Phương Trang	Nữ miền Bắc",
      code: "hn-phuongtrang",
    },
    {
      name: "Thảo Chi	Nữ miền Bắc",
      code: "hn-thaochi",
    },
    {
      name: "Thanh Hà	Nữ miền Bắc",
      code: "hn-thanhha",
    },
    {
      name: "Phương Ly	Nữ miền Nam",
      code: "hcm-phuongly",
    },
    {
      name: "Thùy Dung	Nữ miền Nam	",
      code: "hcm-thuydung",
    },
    {
      name: "Thanh Tùng	Nam miền Bắc",
      code: "hn-thanhtung",
    },
    {
      name: "Bảo Quốc Nam miền Trung",
      code: "hue-baoquoc",
    },
    {
      name: "Minh Quân	Nam miền Nam",
      code: "hcm-minhquan",
    },
    {
      name: "Thanh Phương	Nữ miền Bắc",
      code: "hn-thanhphuong",
    },
    {
      name: "Nam Khánh	Nam miền Bắc",
      code: "hn-namkhanh",
    },
    {
      name: "Lê Yến	Nữ miền Nam",
      code: "hn-leyen",
    },
    {
      name: "Tiến Quân	Nam miền Bắc",
      code: "hn-tienquan",
    },
    {
      name: "Thùy Duyên	Nữ miền Nam",
      code: "hcm-thuyduyen",
    },
  ],
  FPTAI: [
    {
      name: "Ban Mai (Nữ Miền Bắc)",
      code: "banmai",
    },
    {
      name: "Thu Minh (Nữ Miền Bắc)",
      code: "thuminh",
    },
    {
      name: "Mỹ An (Nữ Miền Trung)",
      code: "myan",
    },
    {
      name: "Gia Huy (Nam miền Trung)",
      code: "giahuy",
    },
    {
      name: "Ngọc Lam (Nữ Miền Trung)",
      code: "ngoclam",
    },
    {
      name: "Lê Minh (Nam miền Bắc)",
      code: "leminh",
    },
    {
      name: "Minh Quang (Nam Miền Nam)",
      code: "minhquang",
    },
    {
      name: "Linh San (Nữ Miền Nam)",
      code: "linhsan",
    },
    {
      name: "Lan Nhi (Nữ Miền Nam)",
      code: "lannhi",
    },
  ],
  ZaloAI: [
    {
      name: "Nữ miền Nam",
      code: "1",
    },
    {
      name: "Nữ miền Bắc",
      code: "2",
    },
    {
      name: "Nam miền Nam",
      code: "3",
    },
    {
      name: "Nam miền Bắt",
      code: "4",
    },
  ],
};

//Danh sách các văn bản mẫu
const sampleTexts: string[] = [
  "Quan điểm thứ nhất cho rằng, văn bản là phương thức để truyền đạt thông tin từ một cá nhân này đến cá nhân khác hoặc từ một tổ chức đến cá nhân/tổ chức khác thông qua ngôn ngữ viết trên chất liệu giấy hoặc điện tử.",
  "Theo quan điểm này thì các loại giấy tờ như giấy phép, thông báo, báo cáo,  câu hỏi, tài liệu… đều được coi là văn bản.",
  "Văn bản là một loại hình phương tiện để ghi nhận, lưu giữ và truyền đạt các thông tin từ chủ thể này sang chủ thể khác bằng ký hiệu gọi là chữ viết.",
];
//--------------------------------------------
//############################################

//############################################
//Hàm Render chính
//--------------------------------------------
const Home: React.FC = () => {
  const [selectedService, setSelectedService] = useState<"ViettelAI" | "FPTAI" | "ZaloAI">(
    "ViettelAI"
  );

  const [selectedServiceURL, setSelectedServiceURL] = useState<string>(URL_SERVICE.ViettelAI);

  const [token, setToken] = useState<string>("");
  const [selectedVoice, setSelectedVoice] = useState<string>("1");
  const [speed, setSpeed] = useState<number>(1);
  const [text, setText] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // State to hold audio URL
  const [loading, setLoading] = useState<boolean>(false);

  const handleServiceChange = (service: "ViettelAI" | "FPTAI" | "ZaloAI") => {
    setSelectedService(service);
    setSelectedServiceURL(URL_SERVICE[service]);
    setToken("");
  };

  // Function chạy lúc ấn nút Submit
  const handleConvert = async () => {
    setLoading(true);

    //kiểm tra xem wav có được support bởi browser hay không
    const audio = document.createElement("audio");
    const isWavSupported = !!audio.canPlayType("audio/wav");
    console.log(`WAV supported: ${isWavSupported}`);

    //kiểm tra đủ token và text chưa
    if (!token || !text) {
      alert("Please provide both token and text.");
      return;
    }

    try {
      // gọi tới API bên thứ 3
      const response = await fetch(
        selectedServiceURL,
        serviceAPI(selectedService, token, selectedVoice, speed.toString(), text)
      );
      //Mỗi bên thứ 3 có cách xử lý và phản hồi khác nhau
      if (selectedService === "ViettelAI") {
        //ViettelAI chuyển nguyên file wav về, cơ chế request -> response như bình thường
        console.log("reponse ", response);

        // Lấy audio data dạng Blob -> nhét vào localhost/audio/wav
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(new Blob([audioBlob], { type: "audio/wav" }));

        // đặt audioUrl với state -> hiển thị lên UI
        setAudioUrl(audioUrl);
      } else if (selectedService === "FPTAI") {
        //FPTAI cơ chế là trả về 1 async URL host sẵn bởi họ, không dùng được ngay lúc response
        // Mình phải thực hiện 2 bước gồm:
        // ---Bước 1: check xem response có trả về URL nào không
        // ---Bước 2: thực hiện poll cái async URL đó để kiểm tra URL đó xài được chưa, với nguyên tắc là 1s gọi thử URL 1 lần -> nếu thành công thì ngừng
        const responseData = await response.json();
        console.log("responseData ", responseData);
        if (responseData.error === 0 && responseData.async) {
          const asyncUrl = responseData.async;
          pollAsyncUrl(asyncUrl);
        }
      } else if (selectedService === "ZaloAI") {
        // Zalo AI cơ chế tương tự FPT AI
        const responseData = await response.json();
        console.log("responseData ", responseData);
        if (responseData.error_code === 0 && responseData.data?.url) {
          const asyncUrl = responseData.data.url;
          pollAsyncUrl(asyncUrl);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while trying to convert the text.");
    } finally {
      setLoading(false);
    }
  };

  //Hàm poll Async này để xử lý liên tục thử gọi tới URL host audio mà FPT và Zalo phản hồi mỗi 1s cho tới khi thành công
  const pollAsyncUrl = async (asyncUrl: string) => {
    try {
      const asyncResponse = await fetch(asyncUrl);
      if (asyncResponse.ok) {
        setAudioUrl(asyncUrl);
      } else {
        console.log("Audio not ready yet, retrying...");
        setTimeout(() => pollAsyncUrl(asyncUrl), 1000); // Retry after 3 seconds
      }
    } catch (error) {
      console.error("Error during async polling:", error);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>Text-to-Speech API Demo</h2>

      {/* Service Selection */}
      <div>
        <h3>Select a Service:</h3>
        <label>
          <input
            type="radio"
            name="service"
            value="ViettelAI"
            checked={selectedService === "ViettelAI"}
            onChange={() => handleServiceChange("ViettelAI")}
          />
          ViettelAI
        </label>
        <label style={{ marginLeft: "10px" }}>
          <input
            type="radio"
            name="service"
            value="FPTAI"
            checked={selectedService === "FPTAI"}
            onChange={() => handleServiceChange("FPTAI")}
          />
          FPTAI
        </label>
        <label style={{ marginLeft: "10px" }}>
          <input
            type="radio"
            name="service"
            value="ZaloAI"
            checked={selectedService === "ZaloAI"}
            onChange={() => handleServiceChange("ZaloAI")}
          />
          ZaloAI
        </label>
      </div>

      {/* Token Input */}
      <div style={{ marginTop: "20px" }}>
        <label>
          API Token:
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{ marginLeft: "10px", width: "100%" }}
            placeholder="Enter your API token here"
          />
        </label>
      </div>

      {/* Voice Selection */}
      <div style={{ marginTop: "20px" }}>
        <h3>Select a Voice:</h3>
        {serviceVoiceOptions[selectedService].map((voice) => (
          <button
            key={voice.code}
            onClick={() => setSelectedVoice(voice.code)}
            style={{
              marginRight: "10px",
              padding: "5px 10px",
              backgroundColor: selectedVoice === voice.code ? "#007bff" : "#ccc",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {voice.name}
          </button>
        ))}
      </div>

      {/* Speed Input */}
      <div style={{ marginTop: "20px" }}>
        <label>
          Speed:
          <input
            type="number"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            style={{ marginLeft: "10px", width: "60px" }}
            step="0.1"
            min={MAX_MIN_SERVICE[selectedService].min}
            max={MAX_MIN_SERVICE[selectedService].max}
          />
        </label>
      </div>

      {/* Text Input */}
      <div style={{ marginTop: "20px" }}>
        <label>
          Text to Convert:
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            style={{ width: "100%", marginTop: "10px" }}
            placeholder="Enter the text you want to convert to speech"
          />
        </label>
      </div>

      {loading && <p>Converting text to speech...</p>}

      {/* Sample Texts */}
      <div style={{ marginTop: "20px" }}>
        <h3>Quick Samples:</h3>
        {sampleTexts.map((sample, index) => (
          <button
            key={index}
            onClick={() => setText(sample)}
            style={{
              marginRight: "10px",
              padding: "5px 10px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Sample {index + 1}
          </button>
        ))}
      </div>

      {/* Convert Button */}
      <div style={{ marginTop: "30px" }}>
        <button
          onClick={handleConvert}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Convert to Speech
        </button>
      </div>
      {audioUrl && (
        <div>
          <h2>Saved Audio Playback:</h2>
          <audio controls src={audioUrl} />
        </div>
      )}
    </div>
  );
};

export default Home;
