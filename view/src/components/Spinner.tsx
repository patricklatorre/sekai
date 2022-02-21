import { SpinnerDotted, SpinnerInfinity } from "spinners-react";

function Spinner(props: {message: string}) {
  return (
    <div className="flex flex-col items-center gap-3">
      {
        (props.message !== undefined || props.message !== '') ? (
          <h6 className="text-base opacity-50 text-center">{props.message}</h6>
        ) : (
          <></>
        )
      }
      {/* <SpinnerDotted size={40} thickness={180} color='#6366F1' /> */}
      <SpinnerInfinity size={60} thickness={180} speed={100} color="#6366F1" secondaryColor="rgba(0, 0, 0, 0.44)" />
    </div>
  );
}

export default Spinner;