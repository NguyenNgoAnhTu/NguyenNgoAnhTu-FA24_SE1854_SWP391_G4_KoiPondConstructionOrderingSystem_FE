import { toast } from "react-toastify";

function RequestLog() {
    const fetchDataLog = async (requestId: any) => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(
            `http://localhost:8080/api/request_log/${requestId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) {
            toast.error("Network response was not ok.");
            return;
          }
    
          const data = await response.json();

        } catch (err: any) {
          toast.error(err.message);
        }
      };
  return (
    <div>

    </div>
  )
}

export default RequestLog;