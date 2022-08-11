class BaseController {
  protected readonly EventName = {
    'client-send-clipboard-to-global': '0aeff74e-13cc-56f4-b05c-7a6677187033',
    'client-receive-clipboard-from-global': '2538c3d3-6451-5079-bb4e-77adba52e4c4'
  } as const;
  constructor() {}
}

export default BaseController;
