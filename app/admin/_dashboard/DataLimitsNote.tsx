export function DataLimitsNote() {
  return (
    <aside className="bg-[#FFF8EC] border border-[#F5DDB0] rounded-[14px] px-4 py-3.5 flex flex-col gap-1.5 text-xs leading-[1.7] text-[#5C3B00]">
      <strong className="text-[13px]">この数字の限界</strong>
      <span>・通知を許可した人しか数えられません。拒否した人はトークンが登録されないためです。</span>
      <span>
        ・残るのは「最後に開いた日時」だけです。「登録から7日後も使っていたか」のような推移はさかのぼれないので、推移は保持率で確認します。
      </span>
    </aside>
  )
}
