import { Box } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Fragment from "../../Fragment";

export const ChatFragments = ({ chats = [] }) => {
	/* Reference (for the infinite scroll):
	 * https://blog.logrocket.com/4-ways-to-render-large-lists-in-react/
	 */

	const range = 10;
	const [count, setCount] = useState({
		prev: Math.max(chats.length - range, 0),
		next: chats.length,
	});
	const [hasMore, setHasMore] = useState(true);
	const [current, setCurrent] = useState(chats.slice(count.prev, count.next));

	const getMoreData = useCallback(() => {
		const floor = Math.max(count.prev - range, 0);

		setTimeout(() => {
			let newData = chats.slice(floor, count.prev - 1);
			setCurrent(newData.concat(current));
		}, 1000);
		setCount({
			prev: floor,
			next: count.next,
		});
		if (floor === 0) {
			setHasMore(false);
			console.log({"Run out of contents to render."})
		}
	}, [current, count, chats]);

	/* Reference
	 * https://stackoverflow.com/questions/19614069/get-percentage-scrolled-of-an-element-with-jquery
	 *
	 * Used to detect when the element is at top, such that older chats are rendered, if there is any.
	 */
	const checkAndGetMoreData = useCallback(() => {
		const root = document.getElementById("scrollable");
		let scrollPercentage =
			(100 * root.scrollTop) / (-root.scrollHeight + root.clientHeight);

		if (hasMore && scrollPercentage >= 99) {
			getMoreData();
		}
	}, [hasMore, getMoreData]);

	useEffect(() => {
		let element = document.getElementById("scrollable");
		element.onscroll = () => checkAndGetMoreData();
	}, [checkAndGetMoreData]);

	return (
		<InfiniteScroll
			dataLength={chats.length}
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
					<Fragment key={`chat-${value.id}`} data={value} />
				))}
			</Box>
		</InfiniteScroll>
	);
};