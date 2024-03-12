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
import useAuthorizedApiRequest from '@/utils/authorizeGoogle';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database, Json } from '@/types/supabase';
import { useContext } from "react";
import { GoogleContext } from "@/contexts/GoogleContext";
import Image from 'next/legacy/image';
import { Flex, Box, Text, Button, VStack, HStack, Stack, Heading, IconButton, Grid, Tooltip, useColorMode } from '@chakra-ui/react';
import { slides } from 'googleapis/build/src/apis/slides';

type PropType = {
    options?: EmblaOptionsType
}

type Func = (...args: any[]) => void;

const PlaylistCarousel: React.FC<PropType> = (props) => {
    const { options } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options)
    const supabase = createClientComponentClient<Database>();
    const { tokens, authenticated, playlists, setPlaylists } = useContext(GoogleContext);

    const makeRequest = useAuthorizedApiRequest();

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
  
      const getSongs = useCallback(debounce(() => {
          if (emblaApi && playlists) {
              const slidesInView = emblaApi.slidesInView(); // true for options to get center-aligned slides
              // Determine current playlist based on slidesInView...
              // Remember to handle both scenarios: when one or two playlists are in view
              if (slidesInView.length == 1) {
                  let currentPlaylist = playlists[slidesInView[0]];
                  console.log(currentPlaylist.snippet.title)
              }
              // If needed, handle the scenario where two playlists are in view
          }
      }, 100), [emblaApi, playlists]); // Adjust debounce wait time as necessary
  
      if (emblaApi) {
        // Use 'settle' event to know when scrolling stops
        emblaApi.on('settle', getSongs);
    }

    useEffect(() => {
        async function fetchPlaylists() {
            try {
                const { data: userData, error: userError } = await supabase.auth.getUser();

                if (userError) throw userError;
                if (!userData.user) {
                    throw new Error('No authenticated user found.');
                }

                const userId = userData.user.id;

                let { data, error: updateError } = await supabase
                    .from('profiles') // Temporarily use `any` to bypass typing issues.
                    .select("playlist_data") // Use `->>` to get JSON object as text and alias it as 'tokens'.
                    .eq('id', userId)
                    .single();

                if (updateError) throw updateError;

                if (data) {
                    const playlistsData = await data.playlist_data;
                    if (playlistsData) {
                        const formattedPlaylists: Playlist[] = playlistsData.playlists.map((playlist: any) => ({
                            snippet: {
                                title: playlist.snippet.title,
                                thumbnails: {
                                    maxres: {
                                        url: playlist.snippet.thumbnails.maxres?.url || '/paradise.jpg',
                                    }
                                }
                            },
                        }));
                        setPlaylists(formattedPlaylists)
                        console.log(formattedPlaylists)
                    }
                } else {
                    const playlistsResponse = await makeRequest('/api/ytmusic/getPlaylists', {
                        method: 'GET',
                    });

                    const playlistsData = await playlistsResponse;

                    if (playlistsData.playlists && Array.isArray(playlistsData.playlists)) {
                        setPlaylists(playlistsData.playlists);

                        let { data, error: updateError } = await supabase
                            .from('profiles')
                            .update({ playlist_data: playlistsData })
                            .eq('id', userId);

                        if (updateError) throw updateError;
                    }
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        if (authenticated && tokens) {
            fetchPlaylists();

        }
    }, [authenticated, tokens]);

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    return (
        <section className="embla p-16">
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
