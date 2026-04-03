interface DonationSummaryBannerProps {
  totalDonationAmountLabel: string;
  totalParticipantCountLabel: string;
  imageSrc?: string;
  imageAlt?: string;
}

export const DonationSummaryBanner = ({
  totalDonationAmountLabel,
  totalParticipantCountLabel,
  imageSrc,
  imageAlt = "",
}: DonationSummaryBannerProps) => {
  return (
    <section className="relative h-[112px] overflow-hidden rounded-control bg-primary-400">
      <div className="absolute inset-y-0 left-6 flex w-[153px] flex-col justify-center gap-2">
        <div className="flex w-[126px] flex-col gap-1">
          <p className="text-sm leading-[120%] font-semibold text-primary-50">
            현재까지 모인 기부금
          </p>
          <strong className="text-xl leading-5 font-bold tracking-[-0.02em] text-white">
            {totalDonationAmountLabel}
          </strong>
        </div>

        <p className="text-xs leading-[120%] font-medium text-primary-200">
          총 {totalParticipantCountLabel}명이 가치에 더했어요.
        </p>
      </div>

      {imageSrc ? (
        <img
          src={imageSrc}
          alt={imageAlt}
          aria-hidden={imageAlt ? undefined : true}
          className="absolute right-3 top-1/2 h-[96px] w-[194px] -translate-y-1/2 object-contain object-right"
        />
      ) : (
        <>
          <div
            aria-hidden="true"
            className="absolute right-[-18px] top-[-10px] h-[110px] w-[110px] rounded-full border border-white/15"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-[-32px] right-[42px] h-[96px] w-[96px] rounded-full bg-primary-400/25 blur-md"
          />
        </>
      )}
    </section>
  );
};
