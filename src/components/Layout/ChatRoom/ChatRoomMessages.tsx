import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Box } from "@chakra-ui/react";
import { ChatRoomMessage } from "./ChatRoomMessage";

const range = 20;

export function ChatRoomMessages({ channel, chats = [] }: any) {
  /* Reference (for the infinite scroll):
   * https://blog.logrocket.com/4-ways-to-render-large-lists-in-react/
   */

  const [count, setCount] = useState({
    prev: Math.max(chats.length - range, 0),
    next: chats.length,
  });
  const [hasMore, setHasMore] = useState(true);
  const [current, setCurrent] = useState(chats.slice(count.prev, count.next));
  const initialized = useRef(undefined);

  const getMoreData = useCallback(() => {
    const floor = Math.max(count.prev - range, 0);

    setTimeout(() => {
      let newData = chats.slice(floor, count.prev - 1);

      setCurrent((prev) =>
        newData.concat(
          prev.filter((old) => !newData.some((d) => d.id === old.id))
        )
      );
    }, 1000);
    setCount({
      prev: floor,
      next: count.next,
    });
    if (floor === 0) {
      setHasMore(false);
    }
  }, [count.prev, count.next, chats]);

  /* Reference
   * https://stackoverflow.com/questions/19614069/get-percentage-scrolled-of-an-element-with-jquery
   *
   * Used to detect when the element is at top, such that older chats are rendered, if there is any.
   */
  const checkAndGetMoreData = useCallback(() => {
    const root = document.getElementById("scrollable");

    if (!root) return;

    let scrollPercentage =
      (100 * root.scrollTop) / (-root.scrollHeight + root.clientHeight);

    console.log("Scrolling");

    if (hasMore && scrollPercentage >= 99) {
      getMoreData();
    }
  }, [hasMore, getMoreData]);

  useEffect(() => {
    let element = document.getElementById("scrollable");
    element.onscroll = () => checkAndGetMoreData();
  }, [checkAndGetMoreData]);

  useEffect(() => {
    setCurrent(chats.slice(Math.max(chats.length - range, 0), chats.length));
    setHasMore(true);
  }, [channel, chats]);

  console.log(current);

  return (
    <InfiniteScroll
      hasChildren={true}
      loader={<></>}
      dataLength={current.length}
      inverse={true}
      next={getMoreData}
      hasMore={hasMore}
      scrollThreshold="10px"
    >
      <Box
        position="relative"
        paddingTop="3.2rem"
        paddingBottom="7.5rem"
        zIndex="-1"
      >
        {current.map((value, idx) => (
          <ChatRoomMessage key={`chat-${channel}-${value.id}`} data={value} />
        ))}
      </Box>
    </InfiniteScroll>
  );
}
