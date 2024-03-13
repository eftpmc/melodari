"use client"

import React, { useEffect, useState, useCallback  } from 'react';
import { EmblaOptionsType } from 'embla-carousel'
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import { Playlist } from "@/types/playlist"
import { useContext } from "react";
import { GoogleContext } from "@/contexts/GoogleContext";
import Image from 'next/legacy/image';
import { Flex, Box, Text, Button, VStack, HStack, Stack, Heading, IconButton, Grid, Tooltip, useColorMode } from '@chakra-ui/react';
import googlePlaylists from '@/utils/googlePlaylists';

type PropType = {
    options?: EmblaOptionsType
}

type Func = (...args: any[]) => void;

const PlaylistCarousel: React.FC<PropType> = (props) => {
    const { options } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options)
    const { authenticated, tokens, playlists } = useContext(GoogleContext);
    const { getPlaylistsVideos } = googlePlaylists();

    const debounce = (func: Func, wait: number): Func => {
        let timeout: NodeJS.Timeout | null = null;
      
        return function executedFunction(...args: any[]) {
          const later = () => {
            timeout = null;
            func(...args);
          };
      
          if (timeout) {
            clearTimeout(timeout);
          }
      
          timeout = setTimeout(later, wait);
        };
      };
  
      const getSongs = useCallback(debounce(async () => {
          if (emblaApi && playlists) {
              const slidesInView = emblaApi.slidesInView();
              if (slidesInView.length == 1) {
                  let currentPlaylist = playlists[slidesInView[0]];
                  const videoResponse = getPlaylistsVideos(currentPlaylist.id)
                  console.log(videoResponse)
              }
          }
      }, 100), [emblaApi, playlists]);
  
      if (emblaApi && authenticated && tokens) {
        emblaApi.on('settle', getSongs);
        getSongs()
    }

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    return (
        <section className="embla p-16 pt-0">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {playlists && playlists.map((playlist: Playlist, index: number) => (
                        <Flex
                            className="embla__slide" key={index}
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                            overflow="hidden"
                            p={8}
                        >
                            <Box width="150px" height="150px" position="relative">
                                <Image
                                    src={playlist.snippet.thumbnails.maxres?.url || '/paradise.jpg'}
                                    alt="playlist art"
                                    layout="fill"
                                    objectFit="cover"
                                    sizes='150px'
                                    unoptimized
                                />
                            </Box>
                            <Heading mb={4}>{playlist.snippet.title}</Heading>
                        </Flex>
                    ))}
                </div>
            </div>

            <div className="embla__controls">
                <div className="embla__buttons">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </div>
            </div>
        </section>
    )
}

export default PlaylistCarousel
