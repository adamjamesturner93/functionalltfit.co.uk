declare module 'mux-embed' {
  interface MuxMonitorOptions {
    debug?: boolean;
    data: {
      env_key: string;
      player_name: string;
      player_init_time: number;
      video_id: string;
      video_title: string;
    };
  }

  interface Mux {
    monitor: (video: HTMLVideoElement, options: MuxMonitorOptions) => void;
    destroyMonitor: (video: HTMLVideoElement) => void;
  }

  const mux: Mux;
  export default mux;
}
