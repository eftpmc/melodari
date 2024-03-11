import React, { useEffect, useState } from 'react';
import { EmblaOptionsType } from 'embla-carousel'
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import { Playlist } from "@/types/playlist"
import Image from 'next/legacy/image';
import { Flex, Box, Text, Button, VStack, HStack, Stack, Heading, IconButton, Grid, Tooltip, useColorMode } from '@chakra-ui/react';

type PropType = {
    slides: Playlist[]
    options?: EmblaOptionsType
}

const PlaylistCarousel: React.FC<PropType> = (props) => {
    const { slides, options } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options)
    
    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    return (
        <section className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {slides && slides.map((playlist: Playlist, index: number) => (
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
