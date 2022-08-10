import { apply, tw } from 'twind';
import { css } from 'twind/css';

export function useStyles() {
  const flowKeyframes = css`
    @keyframes flow {
      0% {
        background-position: 0px 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0px 50%;
      }
    }
  `;

  const darkGradientBackground = css`
    background: #141e30; /* fallback for old browsers */
    background: -webkit-linear-gradient(
      to right,
      #243b55,
      #141e30
    ); /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(
      to right,
      #243b55,
      #141e30
    ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  `;

  return {
    'root-wrapper': tw(css`
      ${apply`w-screen h-screen p-[5px]`}
      ${flowKeyframes}
      * {
      }
    `),
    header: tw(css`
      ${apply`h-[50px]`}
      ${apply`flex justify-end items-center `}
    `)
  } as const;
}
