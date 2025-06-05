import { useParams } from "react-router-dom";
import { ChannelBar } from "./ChannelBar";



const Channel = () => {
  const { channelId } = useParams();
  return (
   
 <div className="flex flex-col h-screen ">
  {/* Message List (scrollable, grows) */}  

    <ChannelBar channelId={channelId} />
    <div className="flex-grow flex flex-col-reverse overflow-y-auto p-4 pb-18 bg-gray-100 dark:bg-black">
         <div className="flex w-full space-x-3 max-w-xs">
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
      <div>
        <div className="bg-gray-300 dark:bg-gray-700 p-3 rounded-r-lg rounded-bl-lg">
          <p className="text-sm text-black dark:text-white">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. incoming
          </p>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 leading-none">2 min ago</span>
      </div>
    </div>

     <div className="flex w-full space-x-3 max-w-xs ml-auto justify-end">
      <div>
        <div className="bg-blue-600 dark:bg-blue-800 text-white p-3 rounded-l-lg rounded-br-lg">
          <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod. Outgoing</p>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 leading-none">2 min ago</span>
      </div>
      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600"></div>
    </div>
    </div>


   
  
  <div className="sticky bottom-0  max-w-full bg-gray-300 dark:bg-gray-900 p-4">
    <input
      className="flex items-center h-10 w-full rounded px-3 text-sm text-black dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
      type="text"
      placeholder="Type your message…"
    />
  </div>

  {/* Input Box (fixed at bottom) */}
  
</div>



  );
};

export default Channel;
