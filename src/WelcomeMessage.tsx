type Props = {
  name: string;
  uncompletedCount: number; // 追加
};

const WelcomeMessage = (props: Props) => {
  return (
    <div className="text-lg font-bold text-slate-700">
      現在の未完了タスクは{props.uncompletedCount}個です💪
    </div>
  );
};

export default WelcomeMessage;