import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearNotice } from "../features/cart/cartSlice";

const tone = {
  add: "from-emerald-500 to-emerald-600",
  remove: "from-rose-500 to-rose-600",
  info: "from-slate-600 to-slate-700",
};

export default function CartNotice() {
  const notice = useSelector((state) => state.cart.notice);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => dispatch(clearNotice()), 2800);
    return () => clearTimeout(timer);
  }, [notice, dispatch]);

  if (!notice) return null;

  const gradient = tone[notice.type] || tone.info;

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[2000] flex max-w-sm items-center gap-3 rounded-xl bg-gradient-to-r px-4 py-3 text-sm font-semibold text-white shadow-2xl shadow-black/15 backdrop-blur relative overflow-hidden">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 text-xs font-bold uppercase`}
      >
        {notice.type === "add" ? "+" : notice.type === "remove" ? "–" : "!"}
      </div>
      <div className="flex-1 leading-snug">{notice.message}</div>
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${gradient} opacity-90 -z-10`} />
    </div>
  );
}
